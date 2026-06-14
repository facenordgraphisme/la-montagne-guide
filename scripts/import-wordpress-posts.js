const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@sanity/client');

// Disable TLS verification to prevent 'unable to verify the first certificate' in restricted proxy environments
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

const WP_BASE = 'https://la-montagne-guide.fr';

// ============================================================
// Helpers généraux
// ============================================================

function generateKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function decodeWpEntities(text) {
  if (!text) return text;
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}

function escapeAttr(s) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function textBlock(text, style) {
  return {
    _key: generateKey(),
    _type: 'block',
    style: style || 'normal',
    children: [
      {
        _key: generateKey(),
        _type: 'span',
        text,
      }
    ]
  };
}

// ============================================================
// Tags
// ============================================================

// Catégories WP "Massif>X" -> tag "X" classé comme massif (filtre blog)
const MASSIF_NAMES = new Set([
  'Aiguilles rouges', 'Calanques', 'Cerces', 'Corse', 'Dévoluy', 'Ecrins', 'Embrunais',
  'Engadine', 'Genepi team', 'Grand Briançonnais', 'Haute Maurienne', 'Hérault',
  'Massif central', 'Mont-Blanc', 'Montgenèvre', 'Oberland', 'Oisans', 'Ortles',
  'Piémont', 'Queyras', 'Sainte Victoire', 'Serre Chevalier', 'Taghia', 'Ubaye',
  "Val d'Aoste", 'Valais', 'Valgaudemar', 'Valpelline', 'Vercors', 'Verdon', 'Viso', 'Wadi Rum',
]);

// Catégories/étiquettes WP classées comme catégorie d'activité (filtre blog)
const CATEGORY_NAMES = new Set([
  'Alpinisme', 'Escalade', 'Ski', 'Voyage', 'Via ferrata', 'Cascades de glace',
  'Freerando', 'Raid ski', 'Ski de randonnée', 'Ski hors piste', 'Ski pente raide',
]);

function classifyTag(cleanTagName) {
  if (MASSIF_NAMES.has(cleanTagName)) return 'massif';
  if (CATEGORY_NAMES.has(cleanTagName)) return 'category';
  return 'other';
}

const tagCache = {};

async function getOrCreateTag(tagName) {
  const cleanTagName = tagName.trim();
  if (!cleanTagName) return null;

  if (tagCache[cleanTagName]) return tagCache[cleanTagName];

  const tagSlug = slugify(cleanTagName);
  const tagId = `tag-${tagSlug}`;

  try {
    await client.createOrReplace({
      _type: 'tag',
      _id: tagId,
      name: cleanTagName,
      slug: { _type: 'slug', current: tagSlug },
      tagType: classifyTag(cleanTagName),
    });

    const ref = { _type: 'reference', _ref: tagId };
    tagCache[cleanTagName] = ref;
    return ref;
  } catch (err) {
    console.error(`  ❌ Erreur lors de la création du tag "${cleanTagName}":`, err.message);
    return null;
  }
}

// ============================================================
// Résolution / import des images
// ============================================================

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

async function pickBestCandidate(url) {
  const candidates = getCandidates(url);
  const checks = candidates.map(async (c) => {
    try {
      const response = await axios.head(c, { timeout: 4000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (response.status === 200) {
        return { url: c, size: parseInt(response.headers['content-length'] || '0', 10) };
      }
    } catch (e) {
      // ignore
    }
    return { url: c, size: -1 };
  });

  const results = await Promise.all(checks);
  let best = null;
  for (const r of results) {
    if (r.size >= 0 && (!best || r.size > best.size)) best = r;
  }
  return best ? best.url : candidates[candidates.length - 1];
}

// Cache: original URL -> { _type: 'image', asset: { _type: 'reference', _ref } } | null
const imageCache = new Map();

async function importImage(url) {
  if (!url) return null;
  let cleanUrl = url.trim();
  if (cleanUrl.startsWith('//')) cleanUrl = 'https:' + cleanUrl;
  if (!/^https?:\/\//i.test(cleanUrl)) return null;

  if (imageCache.has(cleanUrl)) {
    const base = imageCache.get(cleanUrl);
    return base ? { _type: 'image', asset: { ...base.asset }, _key: generateKey() } : null;
  }

  try {
    const bestUrl = await pickBestCandidate(cleanUrl);
    console.log(`    [Image] ${cleanUrl} -> ${bestUrl}`);

    const response = await axios({
      method: 'get',
      url: bestUrl,
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const buffer = Buffer.from(response.data);
    const filename = decodeURIComponent(path.basename(bestUrl.split('?')[0])) || 'image.jpg';

    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: response.headers['content-type'] || 'image/jpeg',
    });

    const base = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    imageCache.set(cleanUrl, base);
    return { _type: 'image', asset: { ...base.asset }, _key: generateKey() };
  } catch (err) {
    console.error(`    ❌ Échec image ${cleanUrl}: ${err.message}`);
    imageCache.set(cleanUrl, null);
    return null;
  }
}

// ============================================================
// Résolution des médias (CSV + API REST WordPress)
// ============================================================

// Construit une map { wpMediaId -> { url, alt, caption } } à partir des colonnes CSV de la ligne
function buildRowMediaMap(row) {
  const ids = (row['Image ID'] || '').split('|').map(s => s.trim());
  const urls = (row['Image URL'] || '').split('|').map(s => s.trim());
  const alts = (row['Image Alt Text'] || '').split('|').map(s => decodeWpEntities(s.trim()));
  const captions = (row['Image Caption'] || '').split('|').map(s => decodeWpEntities(s.trim()));

  const map = new Map();
  ids.forEach((id, idx) => {
    if (!id) return;
    map.set(id, {
      url: urls[idx] || '',
      alt: alts[idx] || '',
      caption: captions[idx] || '',
    });
  });
  return map;
}

// Cache REST: wpMediaId -> { url, alt, caption } | null
const mediaCache = new Map();

async function resolveMediaFromRest(mediaId) {
  if (mediaCache.has(mediaId)) return mediaCache.get(mediaId);

  let result = null;
  try {
    const res = await axios.get(`${WP_BASE}/wp-json/wp/v2/media/${mediaId}`, { timeout: 8000 });
    const data = res.data;
    const sizes = (data.media_details && data.media_details.sizes) || {};
    const url = (sizes.full && sizes.full.source_url) || (sizes.large && sizes.large.source_url) || data.source_url;
    const alt = data.alt_text || '';
    const caption = (data.caption && data.caption.rendered)
      ? cheerio.load(data.caption.rendered).text().replace(/\s+/g, ' ').trim()
      : '';
    if (url) result = { url, alt, caption };
  } catch (err) {
    console.log(`    [Media REST] Échec résolution media ${mediaId}: ${err.message}`);
  }

  mediaCache.set(mediaId, result);
  return result;
}

// Résout une référence (ID de média WordPress OU URL directe) en { url, alt, caption }
async function resolveMedia(idOrUrl, rowMediaMap) {
  const val = (idOrUrl || '').trim();
  if (!val) return null;

  if (val.startsWith('http') || val.startsWith('//')) {
    return { url: val.startsWith('//') ? 'https:' + val : val, alt: '', caption: '' };
  }

  if (rowMediaMap.has(val)) {
    const entry = rowMediaMap.get(val);
    if (entry.url) return entry;
  }

  return await resolveMediaFromRest(val);
}

// ============================================================
// Pré-traitement des shortcodes WordPress / Divi
// ============================================================

function preprocessShortcodes(html, { divi, attachedMediaIds }) {
  let s = html;

  // Supprime les commentaires Gutenberg (<!-- wp:... --> / <!-- /wp:... -->)
  s = s.replace(/<!--\s*\/?wp:[^>]*-->/g, '');

  // [embed]url[/embed]
  s = s.replace(/\[embed\]([\s\S]*?)\[\/embed\]/g, (m, url) => `<wp-video data-url="${escapeAttr(url.trim())}"></wp-video>`);

  if (divi) {
    // [et_pb_video ... src="..."]...[/et_pb_video]
    s = s.replace(/\[et_pb_video([^\]]*)\](?:[\s\S]*?\[\/et_pb_video\])?/g, (m, attrs) => {
      const srcMatch = attrs.match(/src=["']([^"']*)["']/);
      const url = srcMatch ? srcMatch[1] : '';
      return url ? `<wp-video data-url="${escapeAttr(url)}"></wp-video>` : '';
    });

    // [et_pb_gallery ... gallery_ids="..."]...[/et_pb_gallery]
    s = s.replace(/\[et_pb_gallery([^\]]*)\](?:[\s\S]*?\[\/et_pb_gallery\])?/g, (m, attrs) => {
      const idsMatch = attrs.match(/gallery_ids=["']([^"']*)["']/);
      const ids = idsMatch ? idsMatch[1] : '';
      return ids ? `<wp-gallery data-ids="${escapeAttr(ids)}"></wp-gallery>` : '';
    });

    // [et_pb_image ... src="..." alt="..."]...[/et_pb_image]
    s = s.replace(/\[et_pb_image([^\]]*)\](?:[\s\S]*?\[\/et_pb_image\])?/g, (m, attrs) => {
      const srcMatch = attrs.match(/src=["']([^"']*)["']/);
      const altMatch = attrs.match(/alt=["']([^"']*)["']/);
      const url = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      return url ? `<wp-image data-src="${escapeAttr(url)}" data-alt="${escapeAttr(alt)}"></wp-image>` : '';
    });
  }

  // [gallery ids="..."] (legacy - ids numériques WordPress ou URLs séparées par | ou ,)
  // Sans attribut "ids", WordPress affiche toutes les images jointes à l'article (attachedMediaIds)
  s = s.replace(/\[gallery([^\]]*)\]/g, (m, attrs) => {
    const idsMatch = attrs.match(/ids=["']([^"']*)["']/);
    const ids = idsMatch ? idsMatch[1] : (attachedMediaIds || []).join(',');
    return ids ? `<wp-gallery data-ids="${escapeAttr(ids)}"></wp-gallery>` : '';
  });

  // [caption ...]<img.../>[/caption]
  s = s.replace(/\[caption([^\]]*)\]([\s\S]*?)\[\/caption\]/g, (m, attrs, content) => {
    const capMatch = attrs.match(/caption=["']([^"']*)["']/);
    let captionText = capMatch ? capMatch[1] : '';

    const $$ = cheerio.load(content);
    const img = $$('img').first();
    const src = img.attr('src') || '';
    const alt = img.attr('alt') || '';

    if (!captionText) captionText = $$.text().replace(/\s+/g, ' ').trim();

    return src
      ? `<wp-image-caption data-src="${escapeAttr(src)}" data-caption="${escapeAttr(captionText)}" data-alt="${escapeAttr(alt)}"></wp-image-caption>`
      : '';
  });

  if (divi) {
    // Supprime les shortcodes et_pb_* restants (sections, rows, columns, text, etc.) en gardant leur contenu interne
    s = s.replace(/\[\/?et_pb_[^\]]*\]/g, '');
  }

  return s;
}

// ============================================================
// Conversion HTML -> Portable Text
// ============================================================

async function processSpecialElement($, el, blocks, rowMediaMap) {
  const $el = $(el);
  const tagName = el.tagName.toLowerCase();

  if (tagName === 'wp-gallery') {
    const idsAttr = $el.attr('data-ids') || '';
    const ids = idsAttr.split(/[|,]/).map(s => s.trim()).filter(Boolean);
    const images = [];
    for (const id of ids) {
      const media = await resolveMedia(id, rowMediaMap);
      if (media && media.url) {
        const imgRef = await importImage(media.url);
        if (imgRef) {
          if (media.alt) imgRef.alt = media.alt;
          if (media.caption) imgRef.caption = media.caption;
          images.push(imgRef);
        }
      }
    }
    if (images.length > 0) {
      blocks.push({ _key: generateKey(), _type: 'gallery', images });
    }
  } else if (tagName === 'wp-video') {
    const url = ($el.attr('data-url') || '').trim().replace(/&amp;/g, '&');
    if (url) blocks.push({ _key: generateKey(), _type: 'video', url });
  } else if (tagName === 'wp-image' || tagName === 'img') {
    const src = $el.attr(tagName === 'wp-image' ? 'data-src' : 'src');
    const altAttr = $el.attr(tagName === 'wp-image' ? 'data-alt' : 'alt');
    const media = await resolveMedia(src, rowMediaMap);
    if (media && media.url) {
      const imgRef = await importImage(media.url);
      if (imgRef) {
        if (altAttr) imgRef.alt = decodeWpEntities(altAttr);
        else if (media.alt) imgRef.alt = media.alt;
        blocks.push(imgRef);
      }
    }
  } else if (tagName === 'wp-image-caption') {
    const src = $el.attr('data-src');
    const caption = $el.attr('data-caption');
    const alt = $el.attr('data-alt');
    const media = await resolveMedia(src, rowMediaMap);
    if (media && media.url) {
      const imgRef = await importImage(media.url);
      if (imgRef) {
        if (caption) imgRef.caption = decodeWpEntities(caption);
        if (alt) imgRef.alt = decodeWpEntities(alt);
        blocks.push(imgRef);
      }
    }
  }
}

const SPECIAL_SELECTOR = 'wp-image-caption, wp-gallery, wp-video, wp-image, img';
const SPECIAL_TAGS = ['wp-image-caption', 'wp-gallery', 'wp-video', 'wp-image', 'img'];

async function nodesToBlocks($, nodes, rowMediaMap) {
  const blocks = [];

  for (const el of nodes) {
    if (el.type === 'text') {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text) blocks.push(textBlock(text, 'normal'));
      continue;
    }
    if (el.type !== 'tag') continue;

    const tagName = el.tagName.toLowerCase();
    const $el = $(el);

    if (tagName === 'p' || tagName === 'div' || tagName === 'span') {
      const specials = $el.find(SPECIAL_SELECTOR).toArray();
      const textOnly = $el.clone();
      textOnly.find(SPECIAL_SELECTOR).remove();
      const text = textOnly.text().replace(/\s+/g, ' ').trim();

      for (const sp of specials) {
        await processSpecialElement($, sp, blocks, rowMediaMap);
      }
      if (text) blocks.push(textBlock(text, 'normal'));
    } else if (/^h[1-6]$/.test(tagName)) {
      const text = $el.text().trim();
      if (text) blocks.push(textBlock(text, tagName === 'h2' ? 'h2' : tagName === 'h3' ? 'h3' : 'normal'));
    } else if (tagName === 'blockquote') {
      const text = $el.text().trim();
      if (text) blocks.push(textBlock(text, 'blockquote'));
    } else if (tagName === 'ul' || tagName === 'ol') {
      const listType = tagName === 'ul' ? 'bullet' : 'number';
      $el.find('li').each((_, li) => {
        const text = $(li).text().trim();
        if (text) blocks.push({ ...textBlock(text, 'normal'), listItem: listType });
      });
    } else if (SPECIAL_TAGS.includes(tagName)) {
      await processSpecialElement($, el, blocks, rowMediaMap);
    } else if (tagName === 'figure') {
      const img = $el.find('img').first();
      const src = img.attr('src');
      const alt = img.attr('alt') || undefined;
      const caption = $el.find('figcaption').text().trim() || undefined;
      if (src) {
        const media = await resolveMedia(src, rowMediaMap);
        if (media && media.url) {
          const imgRef = await importImage(media.url);
          if (imgRef) {
            if (caption) imgRef.caption = decodeWpEntities(caption);
            if (alt) imgRef.alt = decodeWpEntities(alt);
            blocks.push(imgRef);
          }
        }
      }
    } else {
      // Wrapper inconnu : on continue récursivement sur ses enfants
      const childNodes = $el.contents().toArray();
      if (childNodes.length > 0) {
        const nested = await nodesToBlocks($, childNodes, rowMediaMap);
        blocks.push(...nested);
      }
    }
  }

  return blocks;
}

// Regroupe les images individuelles consécutives en blocs "gallery"
function groupImagesIntoGalleries(blocks) {
  const grouped = [];
  let current = [];

  const flush = () => {
    if (current.length === 0) return;
    if (current.length === 1) {
      grouped.push(current[0]);
    } else {
      grouped.push({ _key: generateKey(), _type: 'gallery', images: current });
    }
    current = [];
  };

  for (const block of blocks) {
    if (block._type === 'image') {
      current.push(block);
    } else {
      flush();
      grouped.push(block);
    }
  }
  flush();

  return grouped;
}

async function parseContent(content, rowMediaMap) {
  if (!content || !content.trim()) return [];

  const isDivi = /\[et_pb_/i.test(content);
  const attachedMediaIds = Array.from(rowMediaMap.keys());
  const preprocessed = preprocessShortcodes(content, { divi: isDivi, attachedMediaIds });
  const $ = cheerio.load(preprocessed);

  const blocks = await nodesToBlocks($, $('body').contents().toArray(), rowMediaMap);
  return groupImagesIntoGalleries(blocks);
}

function deriveExcerpt(bodyBlocks) {
  for (const block of bodyBlocks) {
    if (block._type === 'block' && block.style === 'normal' && !block.listItem) {
      const text = (block.children || []).map(c => c.text || '').join('').trim();
      if (text) {
        if (text.length <= 197) return text;
        const truncated = text.slice(0, 197);
        const lastSpace = truncated.lastIndexOf(' ');
        const cut = lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated;
        return cut.trim() + '...';
      }
    }
  }
  return undefined;
}

// ============================================================
// Résolution du slug canonique via l'API REST WordPress
// ============================================================

async function resolveCanonicalSlug(wpId, title) {
  try {
    const res = await axios.get(`${WP_BASE}/wp-json/wp/v2/posts/${wpId}`, { timeout: 8000 });
    if (res.data && res.data.slug) return res.data.slug;
  } catch (err) {
    console.log(`  [Slug REST] Échec pour ID ${wpId}: ${err.message}`);
  }
  return slugify(title);
}

// ============================================================
// Programme principal
// ============================================================

const args = process.argv.slice(2);
let startIdx = 0;
let limitCount = 20;
let cleanAll = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--start' && args[i + 1] !== undefined) startIdx = parseInt(args[i + 1], 10);
  if (args[i] === '--limit' && args[i + 1] !== undefined) limitCount = parseInt(args[i + 1], 10);
  if (args[i] === '--clean') cleanAll = true;
}

async function run() {
  console.log("=== Migration WordPress -> Sanity (v2) ===");

  if (cleanAll) {
    console.log("Nettoyage : suppression des anciens articles importés (wp-post-*)...");
    const query = `*[_type == "post" && (_id match "wp-post-*" || _id match "drafts.wp-post-*")]{_id, title}`;
    const oldPosts = await client.fetch(query);
    console.log(`Trouvé ${oldPosts.length} article(s) à supprimer.`);
    for (const p of oldPosts) {
      console.log(`  Suppression: ${p._id} (${p.title || 'sans titre'})`);
      await client.delete(p._id);
    }
    console.log("Nettoyage terminé.\n");
  }

  const csvPath = path.join(__dirname, '..', 'public', 'Articles-Export-2026-June-07-1940.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`Fichier CSV non trouvé au chemin : ${csvPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, { columns: true, skip_empty_lines: true, trim: true });
  console.log(`Nombre total d'articles trouvés dans le CSV : ${records.length}`);

  const idKey = Object.keys(records[0]).find(k => k.trim().replace(/^﻿/, '').toLowerCase() === 'id');

  records.sort((a, b) => {
    const timeA = a.Date ? new Date(a.Date).getTime() : 0;
    const timeB = b.Date ? new Date(b.Date).getTime() : 0;
    return timeB - timeA;
  });

  const batch = records.slice(startIdx, startIdx + limitCount);
  console.log(`Traitement de ${batch.length} article(s) (index ${startIdx} à ${startIdx + batch.length - 1} sur ${records.length})\n`);

  for (let i = 0; i < batch.length; i++) {
    const row = batch[i];
    const globalIdx = startIdx + i;
    const wpId = row[idKey];

    console.log(`--------------------------------------------------`);
    console.log(`[${globalIdx + 1}/${records.length}] "${row.Title}" (Date: ${row.Date}, ID WordPress: ${wpId})`);

    try {
      // 1. ActivityType depuis les catégories
      const categories = row.Catégories || '';
      const lowerCats = categories.toLowerCase();
      let activityType;
      if (lowerCats.includes('alpinisme')) activityType = 'alpinisme';
      else if (lowerCats.includes('ski')) activityType = 'ski';
      else if (lowerCats.includes('escalade')) activityType = 'escalade';
      else if (lowerCats.includes('voyage')) activityType = 'voyage';

      // 2. Tags / catégories -> références "tag"
      const tagsSet = new Set();
      if (row.Étiquettes) {
        row.Étiquettes.split('|').map(t => t.trim()).filter(Boolean).forEach(t => tagsSet.add(t));
      }
      if (row.Catégories) {
        row.Catégories.split('|').forEach(cat => {
          cat.split('>').map(p => p.trim()).filter(Boolean).forEach(p => tagsSet.add(p));
        });
      }
      const tagRefs = [];
      for (const tag of tagsSet) {
        const ref = await getOrCreateTag(tag);
        if (ref) tagRefs.push({ _key: generateKey(), ...ref });
      }

      // 3. Slug canonique (API REST WordPress, fallback slugify)
      const actualSlug = await resolveCanonicalSlug(wpId, row.Title) || slugify(row.Title) || `article-${wpId}`;
      console.log(`  Slug: ${actualSlug}`);

      // 4. Map des médias attachés depuis le CSV (id WP -> url/alt/caption)
      const rowMediaMap = buildRowMediaMap(row);

      // 5. Conversion du contenu en blocs Portable Text
      console.log(`  Analyse du contenu...`);
      const bodyBlocks = await parseContent(row.Content || '', rowMediaMap);
      console.log(`  ${bodyBlocks.length} bloc(s) générés.`);

      // 6. Image principale (première de la colonne "Image URL")
      let mainImageRef = null;
      const featUrls = (row['Image URL'] || '').split('|').map(s => s.trim()).filter(Boolean);
      if (featUrls.length > 0) {
        const imgRef = await importImage(featUrls[0]);
        if (imgRef) mainImageRef = { _type: 'image', asset: imgRef.asset };
      }

      // 7. Extrait dérivé du premier paragraphe non vide
      const excerpt = deriveExcerpt(bodyBlocks);

      // 8. Construction et écriture du document
      const doc = {
        _type: 'post',
        _id: `wp-post-${wpId}`,
        title: decodeWpEntities(row.Title),
        slug: { _type: 'slug', current: actualSlug },
        excerpt,
        mainImage: mainImageRef || undefined,
        publishedAt: row.Date ? new Date(row.Date).toISOString() : new Date().toISOString(),
        body: bodyBlocks,
        activityType,
        tags: tagRefs.length > 0 ? tagRefs : undefined,
      };

      await client.createOrReplace(doc);
      console.log(`  ✅ Article importé avec succès.`);
    } catch (err) {
      console.error(`  ❌ Erreur lors de l'importation de l'article (ID ${wpId}):`, err);
    }
  }

  console.log(`\n=== Migration du lot terminée ===`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
