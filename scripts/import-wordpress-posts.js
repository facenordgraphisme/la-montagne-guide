const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@sanity/client');

// Disable TLS verification to prevent 'unable to verify the first certificate' in restricted proxy environments
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load environment variables manually since dotenv was installed
require('dotenv').config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Erreur : Les variables NEXT_PUBLIC_SANITY_PROJECT_ID et SANITY_API_TOKEN doivent être définies dans votre fichier .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-05-01',
  token,
  useCdn: false,
});

// Cache for tag references to avoid duplicate creations / lookups
const tagCache = {};

// Helper: generate unique keys for array items
function generateKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Helper: Slugify title
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '')    // Remove invalid chars
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/-+/g, '-');           // Remove duplicate -
}

async function getOrCreateTag(tagName) {
  const cleanTagName = tagName.trim();
  if (!cleanTagName) return null;

  if (tagCache[cleanTagName]) {
    return tagCache[cleanTagName];
  }

  const tagSlug = slugify(cleanTagName);
  const tagId = `tag-${tagSlug}`;

  try {
    const doc = {
      _type: 'tag',
      _id: tagId,
      name: cleanTagName,
      slug: {
        _type: 'slug',
        current: tagSlug,
      }
    };

    console.log(`[Tag] Récupération ou création du tag : "${cleanTagName}"`);
    await client.createOrReplace(doc);

    // Keep only the core reference structure in cache (without the post-specific _key)
    const ref = {
      _type: 'reference',
      _ref: tagId
    };
    tagCache[cleanTagName] = ref;
    return ref;
  } catch (err) {
    console.error(`❌ Erreur lors de la création du tag "${cleanTagName}":`, err.message);
    return null;
  }
}

// Helper: Get candidate URLs for WordPress uploads to find the original high-resolution version
function getCandidates(url) {
  const candidates = [];
  let cleanUrl = url.trim();
  
  if (cleanUrl.startsWith(',')) cleanUrl = cleanUrl.substring(1).trim();
  if (cleanUrl.endsWith(',')) cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1).trim();
  if (cleanUrl.startsWith('//')) cleanUrl = 'https:' + cleanUrl;

  try {
    const urlObj = new URL(cleanUrl);
    const pathname = urlObj.pathname;
    const dir = urlObj.origin + path.dirname(pathname);
    const ext = path.extname(pathname);
    let name = path.basename(pathname, ext);

    let dimensions = null;
    const dimMatch = name.match(/-(\d+x\d+)$/);
    if (dimMatch) {
      dimensions = dimMatch[1];
      name = name.slice(0, -dimMatch[0].length);
    }

    let eSuffix = null;
    const eMatch = name.match(/-e(\d+)$/);
    if (eMatch) {
      eSuffix = eMatch[1];
      name = name.slice(0, -eMatch[0].length);
    }

    const dimMatch2 = name.match(/-(\d+x\d+)$/);
    if (dimMatch2) {
      dimensions = dimMatch2[1];
      name = name.slice(0, -dimMatch2[0].length);
    }

    let hasResized = false;
    if (name.endsWith('.resized')) {
      hasResized = true;
      name = name.slice(0, -'.resized'.length);
    }

    const buildUrl = (n, resized, e, dim) => {
      let baseName = n;
      if (resized) baseName += '.resized';
      if (e) baseName += `-e${e}`;
      if (dim) baseName += `-${dim}`;
      return `${dir}/${baseName}${ext}`;
    };

    // Candidates in order of preference (original unresized first)
    candidates.push(buildUrl(name, false, null, null));
    if (hasResized) candidates.push(buildUrl(name, true, null, null));
    if (eSuffix) candidates.push(buildUrl(name, false, eSuffix, null));
    if (hasResized && eSuffix) candidates.push(buildUrl(name, true, eSuffix, null));
    if (dimensions) candidates.push(buildUrl(name, false, null, dimensions));
    if (hasResized && dimensions) candidates.push(buildUrl(name, true, null, dimensions));
    if (eSuffix && dimensions) candidates.push(buildUrl(name, false, eSuffix, dimensions));
    if (hasResized && eSuffix && dimensions) candidates.push(buildUrl(name, true, eSuffix, dimensions));
  } catch (err) {
    // Fail-safe
  }

  candidates.push(cleanUrl);
  return Array.from(new Set(candidates));
}

// Helper: Downloader and Uploader for Images
async function importImage(url) {
  if (!url) return null;
  
  const candidates = getCandidates(url);
  let bestUrl = candidates[candidates.length - 1]; // default to fallback
  let maxBytes = 0;

  console.log(`\nRecherche de la meilleure qualité pour l'image : ${url}`);
  
  // Check candidates in parallel
  const checks = candidates.map(async (c) => {
    try {
      const response = await axios.head(c, { 
        timeout: 4000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (response.status === 200) {
        const size = parseInt(response.headers['content-length'] || '0', 10);
        return { url: c, size, exists: true };
      }
    } catch (e) {
      // Ignore
    }
    return { url: c, size: 0, exists: false };
  });

  const results = await Promise.all(checks);
  
  let chosen = null;
  for (const res of results) {
    if (res.exists && res.size > maxBytes) {
      maxBytes = res.size;
      chosen = res.url;
    }
  }

  if (chosen) {
    bestUrl = chosen;
    console.log(`Meilleure version trouvée : ${bestUrl} (${(maxBytes / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`Aucune alternative trouvée, utilisation de l'URL par défaut : ${bestUrl}`);
  }

  try {
    console.log(`Téléchargement de l'image : ${bestUrl}`);
    const response = await axios({
      method: 'get',
      url: bestUrl,
      responseType: 'arraybuffer',
      timeout: 25000,
    });
    
    const buffer = Buffer.from(response.data);
    const filename = decodeURIComponent(path.basename(bestUrl.split('?')[0])) || 'image.jpg';
    
    console.log(`Upload de l'image sur Sanity...`);
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: response.headers['content-type'] || 'image/jpeg',
    });
    
    console.log(`Image uploadée avec succès. ID: ${asset._id}`);
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      }
    };
  } catch (error) {
    console.error(`❌ Échec du téléchargement/upload de l'image : ${bestUrl}`, error.message);
    return null;
  }
}

// Convert HTML content and WordPress shortcodes to Portable Text blocks
async function convertHtmlToPortableText(htmlContent, row, liveGalleries = []) {
  const blocks = [];
  if (!htmlContent) return blocks;

  let galleryCounter = 0;

  // Pre-process shortcodes like [gallery], [caption], [embed] and [et_pb_video]
  let cleanedHtml = htmlContent
    // Clean video embeds
    .replace(/\[embed\]([\s\S]*?)\[\/embed\]/g, '<wp-video url="$1"></wp-video>')
    .replace(/\[et_pb_video[^\]]*src="([^"]*)"[^\]]*\]/g, '<wp-video url="$1"></wp-video>')
    .replace(/\[et_pb_video[^\]]*src='([^']*)'[^\]]*\]/g, '<wp-video url="$1"></wp-video>')
    // Clean other gallery shortcodes. Fallback to liveGalleries or row['Image URL']
    .replace(/\[(?:et_pb_)?gallery[^\]]*\]/g, (match) => {
      const currentIdx = galleryCounter++;
      let urls = [];
      
      if (liveGalleries && liveGalleries[currentIdx] && liveGalleries[currentIdx].length > 0) {
        urls = liveGalleries[currentIdx];
      } else {
        if (row && row['Image URL']) {
          urls = row['Image URL'].split(/[|,]/).map(u => u.trim()).filter(Boolean);
        }
      }
      
      const cleanUrls = urls.map(u => u.trim()).filter(u => u.startsWith('http') || u.startsWith('//'));
      return `<wp-gallery-container urls="${cleanUrls.join(',')}"></wp-gallery-container>`;
    })
    // Pre-process captions and turn them into wp-image-caption tags
    .replace(/\[caption([^\]]*)\]([\s\S]*?)\[\/caption\]/g, (match, attrs, content) => {
      const capMatch = attrs.match(/caption="([^"]*)"/);
      let captionText = capMatch ? capMatch[1] : '';

      const $ = cheerio.load(content);
      const img = $('img');
      const src = img.attr('src') || '';
      const alt = img.attr('alt') || '';
      
      if (!captionText) {
        captionText = $.text().replace(/\s+/g, ' ').trim();
      }

      return `<wp-image-caption src="${src}" caption="${captionText}" alt="${alt}"></wp-image-caption>`;
    });

  const $ = cheerio.load(cleanedHtml);

  // Traverse children of body
  const bodyChildren = $('body').children();

  for (let i = 0; i < bodyChildren.length; i++) {
    const el = bodyChildren[i];
    const tagName = el.tagName.toLowerCase();

    if (tagName === 'p') {
      const text = $(el).clone().find('wp-image-caption, wp-gallery-container, wp-video, img').remove().end().text().trim();
      const imgs = $(el).find('img');
      const galleryContainers = $(el).find('wp-gallery-container');
      const imageCaptions = $(el).find('wp-image-caption');
      const videos = $(el).find('wp-video');

      // Process captions inside paragraph
      if (imageCaptions.length > 0) {
        for (let j = 0; j < imageCaptions.length; j++) {
          const src = $(imageCaptions[j]).attr('src');
          const caption = $(imageCaptions[j]).attr('caption');
          const alt = $(imageCaptions[j]).attr('alt');
          const imageAsset = await importImage(src);
          if (imageAsset) {
            imageAsset._key = generateKey();
            imageAsset.caption = caption || undefined;
            imageAsset.alt = alt || undefined;
            blocks.push(imageAsset);
          }
        }
      }

      // Process videos inside paragraph
      if (videos.length > 0) {
        for (let j = 0; j < videos.length; j++) {
          const urlAttr = $(videos[j]).attr('url');
          if (urlAttr) {
            blocks.push({
              _key: generateKey(),
              _type: 'video',
              url: urlAttr.trim().replace(/&amp;/g, '&')
            });
          }
        }
      }

      // Process galleries inside paragraph
      if (galleryContainers.length > 0) {
        for (let j = 0; j < galleryContainers.length; j++) {
          const urlsAttr = $(galleryContainers[j]).attr('urls') || '';
          const urls = urlsAttr.split(',').filter(Boolean);
          const galleryImages = [];
          for (const u of urls) {
            const imageAsset = await importImage(u);
            if (imageAsset) {
              imageAsset._key = generateKey();
              galleryImages.push(imageAsset);
            }
          }
          if (galleryImages.length > 0) {
            blocks.push({
              _key: generateKey(),
              _type: 'gallery',
              images: galleryImages
            });
          }
        }
      }

      // Process individual images inside paragraph
      if (imgs.length > 0) {
        for (let j = 0; j < imgs.length; j++) {
          const isInsideCaption = $(imgs[j]).closest('wp-image-caption').length > 0;
          if (!isInsideCaption) {
            const src = $(imgs[j]).attr('src');
            const imageAsset = await importImage(src);
            if (imageAsset) {
              imageAsset._key = generateKey();
              blocks.push(imageAsset);
            }
          }
        }
      }
      
      if (text) {
        blocks.push({
          _key: generateKey(),
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: generateKey(),
              _type: 'span',
              text: text,
            }
          ]
        });
      }
    } else if (tagName === 'wp-image-caption') {
      const src = $(el).attr('src');
      const caption = $(el).attr('caption');
      const alt = $(el).attr('alt');
      const imageAsset = await importImage(src);
      if (imageAsset) {
        imageAsset._key = generateKey();
        imageAsset.caption = caption || undefined;
        imageAsset.alt = alt || undefined;
        blocks.push(imageAsset);
      }
    } else if (tagName === 'wp-video') {
      const urlAttr = $(el).attr('url');
      if (urlAttr) {
        blocks.push({
          _key: generateKey(),
          _type: 'video',
          url: urlAttr.trim().replace(/&amp;/g, '&')
        });
      }
    } else if (tagName === 'a') {
      const imgs = $(el).find('img');
      const captions = $(el).find('wp-image-caption');
      const videos = $(el).find('wp-video');
      
      if (captions.length > 0) {
        for (let j = 0; j < captions.length; j++) {
          const src = $(captions[j]).attr('src');
          const caption = $(captions[j]).attr('caption');
          const alt = $(captions[j]).attr('alt');
          const imageAsset = await importImage(src);
          if (imageAsset) {
            imageAsset._key = generateKey();
            imageAsset.caption = caption || undefined;
            imageAsset.alt = alt || undefined;
            blocks.push(imageAsset);
          }
        }
      }
      
      if (videos.length > 0) {
        for (let j = 0; j < videos.length; j++) {
          const urlAttr = $(videos[j]).attr('url');
          if (urlAttr) {
            blocks.push({
              _key: generateKey(),
              _type: 'video',
              url: urlAttr.trim().replace(/&amp;/g, '&')
            });
          }
        }
      }
      
      if (imgs.length > 0) {
        for (let j = 0; j < imgs.length; j++) {
          const isInsideCaption = $(imgs[j]).closest('wp-image-caption').length > 0;
          if (!isInsideCaption) {
            const src = $(imgs[j]).attr('src');
            const imageAsset = await importImage(src);
            if (imageAsset) {
              imageAsset._key = generateKey();
              blocks.push(imageAsset);
            }
          }
        }
      }
    } else if (tagName === 'wp-gallery-container') {
      const urlsAttr = $(el).attr('urls') || '';
      const urls = urlsAttr.split(',').filter(Boolean);
      const galleryImages = [];
      for (const u of urls) {
        const imageAsset = await importImage(u);
        if (imageAsset) {
          imageAsset._key = generateKey();
          galleryImages.push(imageAsset);
        }
      }
      if (galleryImages.length > 0) {
        blocks.push({
          _key: generateKey(),
          _type: 'gallery',
          images: galleryImages
        });
      }
    } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      const text = $(el).text().trim();
      if (text) {
        blocks.push({
          _key: generateKey(),
          _type: 'block',
          style: tagName === 'h2' ? 'h2' : tagName === 'h3' ? 'h3' : 'normal',
          children: [
            {
              _key: generateKey(),
              _type: 'span',
              text: text,
            }
          ]
        });
      }
    } else if (tagName === 'blockquote') {
      const text = $(el).text().trim();
      if (text) {
        blocks.push({
          _key: generateKey(),
          _type: 'block',
          style: 'blockquote',
          children: [
            {
              _key: generateKey(),
              _type: 'span',
              text: text,
            }
          ]
        });
      }
    } else if (['ul', 'ol'].includes(tagName)) {
      const listType = tagName === 'ul' ? 'bullet' : 'number';
      const lis = $(el).find('li');
      lis.each((_, li) => {
        const text = $(li).text().trim();
        if (text) {
          blocks.push({
            _key: generateKey(),
            _type: 'block',
            style: 'normal',
            listItem: listType,
            children: [
              {
                _key: generateKey(),
                _type: 'span',
                text: text,
              }
            ]
          });
        }
      });
    } else if (tagName === 'img') {
      const src = $(el).attr('src');
      const imageAsset = await importImage(src);
      if (imageAsset) {
        imageAsset._key = generateKey();
        blocks.push(imageAsset);
      }
    }
  }

  // If no blocks were parsed but we have raw content, fallback to a single block
  if (blocks.length === 0 && htmlContent.trim()) {
    blocks.push({
      _key: generateKey(),
      _type: 'block',
      style: 'normal',
      children: [
        {
          _key: generateKey(),
          _type: 'span',
          text: cheerio.load(htmlContent).text().trim().substring(0, 1000)
        }
      ]
    });
  }

  // Post-process: Group consecutive individual 'image' blocks into a single 'gallery' block
  const groupedBlocks = [];
  let currentGalleryImages = [];

  for (const block of blocks) {
    if (block._type === 'image') {
      currentGalleryImages.push(block);
    } else {
      if (currentGalleryImages.length > 0) {
        if (currentGalleryImages.length === 1) {
          groupedBlocks.push(currentGalleryImages[0]);
        } else {
          groupedBlocks.push({
            _key: generateKey(),
            _type: 'gallery',
            images: [...currentGalleryImages]
          });
        }
        currentGalleryImages = [];
      }
      groupedBlocks.push(block);
    }
  }

  if (currentGalleryImages.length > 0) {
    if (currentGalleryImages.length === 1) {
      groupedBlocks.push(currentGalleryImages[0]);
    } else {
      groupedBlocks.push({
        _key: generateKey(),
        _type: 'gallery',
        images: [...currentGalleryImages]
      });
    }
  }

  return groupedBlocks;
}

// Parse Command Line Arguments
const args = process.argv.slice(2);
let startIdx = 0;
let limitCount = 25;
let cleanAll = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--start' && args[i + 1] !== undefined) {
    startIdx = parseInt(args[i + 1], 10);
  }
  if (args[i] === '--limit' && args[i + 1] !== undefined) {
    limitCount = parseInt(args[i + 1], 10);
  }
  if (args[i] === '--clean') {
    cleanAll = true;
  }
}

async function run() {
  console.log("=== Début de la migration WordPress -> Sanity ===");
  console.log(`Index de départ: ${startIdx}, Limite: ${limitCount}`);

  if (cleanAll) {
    console.log("Option --clean détectée. Suppression de tous les anciens articles...");
    const query = `*[_type == "post" && _id match "wp-post-*"]{ _id }`;
    const oldPosts = await client.fetch(query);
    console.log(`Trouvé ${oldPosts.length} articles à supprimer.`);
    for (const p of oldPosts) {
      console.log(`Suppression du post : ${p._id}`);
      await client.delete(p._id);
    }
    console.log("Suppression terminée.");
  }

  const csvPath = path.join(__dirname, '..', 'public', 'Articles-Export-2026-June-07-1940.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`Fichier CSV non trouvé au chemin : ${csvPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf8');
  console.log("Lecture du fichier CSV...");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Nombre total d'articles trouvés dans le CSV : ${records.length}`);

  // Sort records by Date descending (most recent first) to import newest first
  console.log("Tri des articles par date décroissante (plus récents en premier)...");
  records.sort((a, b) => {
    const timeA = a.Date ? new Date(a.Date).getTime() : 0;
    const timeB = b.Date ? new Date(b.Date).getTime() : 0;
    return timeB - timeA;
  });

  const batch = records.slice(startIdx, startIdx + limitCount);
  console.log(`Traitement du lot de ${batch.length} articles (index ${startIdx} à ${startIdx + batch.length - 1})...`);

  for (let i = 0; i < batch.length; i++) {
    const row = batch[i];
    const globalIdx = startIdx + i;
    
    // Dynamically detect the 'id' key to handle potential UTF-8 BOM characters
    const idKey = Object.keys(row).find(k => k.trim().replace(/^\uFEFF/i, '').toLowerCase() === 'id');
    const wpId = idKey ? row[idKey] : globalIdx;
    
    console.log(`\n--------------------------------------------------`);
    console.log(`[${globalIdx + 1}/${records.length}] Importation de : "${row.Title}" (Date: ${row.Date}, ID WordPress: ${wpId})`);

    try {
      // 1. Map ActivityType (Catégories)
      const categories = row.Catégories || '';
      let activityType = undefined;
      const lowerCats = categories.toLowerCase();
      if (lowerCats.includes('alpinisme')) {
        activityType = 'alpinisme';
      } else if (lowerCats.includes('ski')) {
        activityType = 'ski';
      } else if (lowerCats.includes('escalade')) {
        activityType = 'escalade';
      } else if (lowerCats.includes('voyage')) {
        activityType = 'voyage';
      }

      // 2. Extract Tags and Categories as referenced Tag documents
      const tagRefs = [];
      const tagsSet = new Set();
      if (row.Étiquettes) {
        row.Étiquettes.split('|').map(t => t.trim()).filter(Boolean).forEach(t => tagsSet.add(t));
      }
      if (row.Catégories) {
        row.Catégories.split('|').forEach(cat => {
          const parts = cat.split('>').map(p => p.trim()).filter(Boolean);
          parts.forEach(p => tagsSet.add(p));
        });
      }
      for (const tag of tagsSet) {
        const ref = await getOrCreateTag(tag);
        if (ref) {
          tagRefs.push({
            _key: generateKey(), // Ensure each item in the document tags array has a unique _key
            ...ref
          });
        }
      }

      // 3. Generate clean Slug
      const cleanSlug = slugify(row.Title) || `article-${wpId}`;

      // 4. Fetch live page to scrape ordered galleries / featured image
      let liveFeaturedImage = null;
      let liveGalleries = [];
      try {
        const liveUrl = `https://la-montagne-guide.fr/${cleanSlug}/`;
        console.log(`[Scrape Live Fallback] Analyse de la page : ${liveUrl}`);
        const response = await axios.get(liveUrl, { timeout: 8000 });
        const $wp = cheerio.load(response.data);
        
        // Find featured image
        const ogImage = $wp('meta[property="og:image"]').attr('content');
        if (ogImage) {
          liveFeaturedImage = ogImage;
        } else {
          const featImg = $wp('.et_post_meta_wrapper img, .entry-featured-image-url img, .post-thumbnail img').first().attr('src');
          if (featImg) {
            liveFeaturedImage = featImg;
          }
        }
        
        // Find all galleries on page in order
        $wp('.et_pb_gallery, .gallery, .wp-block-gallery').each((_, galleryEl) => {
          const galleryUrls = [];
          $wp(galleryEl).find('img, a').each((__, imgEl) => {
            const src = $wp(imgEl).attr('src') || $wp(imgEl).attr('href');
            if (src && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.includes('/wp-content/uploads/'))) {
              let cleanSrc = src.trim();
              if (cleanSrc.startsWith('//')) cleanSrc = 'https:' + cleanSrc;
              galleryUrls.push(cleanSrc);
            }
          });
          
          // Deduplicate urls and pick original high-res candidates
          const uniqueUrls = [];
          const seen = new Set();
          for (const url of galleryUrls) {
            const candidates = getCandidates(url);
            const originalUrl = candidates[0];
            if (!seen.has(originalUrl)) {
              seen.add(originalUrl);
              uniqueUrls.push(originalUrl);
            }
          }
          if (uniqueUrls.length > 0) {
            liveGalleries.push(uniqueUrls);
          }
        });
        
        console.log(`[Scrape Live Fallback] Récupération réussie : ${liveGalleries.length} galeries distinctes.`);
      } catch (err) {
        console.log(`[Scrape Live Fallback] Échec ou timeout de l'analyse en direct : ${err.message}`);
      }

      // 5. Upload main featured image if available
      let mainImageRef = null;
      let featUrl = null;
      if (row['Image URL']) {
        const imageUrls = row['Image URL'].split('|').filter(Boolean);
        if (imageUrls.length > 0) {
          featUrl = imageUrls[0];
        }
      }
      if (!featUrl && liveFeaturedImage) {
        featUrl = liveFeaturedImage;
        console.log(`Utilisation de l'image mise en avant trouvée en direct : ${featUrl}`);
      }
      if (featUrl) {
        const imageAsset = await importImage(featUrl);
        if (imageAsset) {
          mainImageRef = imageAsset;
        }
      }

      // 6. Convert body to Portable Text blocks and download nested images with ordered galleries
      const bodyBlocks = await convertHtmlToPortableText(row.Content, row, liveGalleries);

      // 7. Build document
      const doc = {
        _type: 'post',
        _id: `wp-post-${wpId}`, // Maintain unique reference
        title: row.Title,
        slug: {
          _type: 'slug',
          current: cleanSlug,
        },
        mainImage: mainImageRef || undefined,
        publishedAt: row.Date ? new Date(row.Date).toISOString() : new Date().toISOString(),
        body: bodyBlocks,
        activityType: activityType,
        tags: tagRefs.length > 0 ? tagRefs : undefined,
      };

      // 8. Write to Sanity
      console.log(`Création ou mise à jour de l'article dans Sanity...`);
      await client.createOrReplace(doc);
      console.log(`✅ Article importé avec succès dans Sanity.`);

    } catch (err) {
      console.error(`❌ Erreur lors de l'importation de l'article (ID ${wpId}):`, err);
    }
  }

  console.log(`\n==================================================`);
  console.log(`Migration du lot terminée avec succès.`);
}

run();
