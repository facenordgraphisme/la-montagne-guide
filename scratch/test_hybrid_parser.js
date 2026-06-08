const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function getCandidates(url) {
  const candidates = [];
  let cleanUrl = url.trim();
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
    const buildUrl = (n, dim) => {
      return `${dir}/${n}${dim ? '-' + dim : ''}${ext}`;
    };
    candidates.push(buildUrl(name, null));
  } catch (err) {}
  candidates.push(cleanUrl);
  return Array.from(new Set(candidates));
}

// Generate random key
function generateKey() {
  return Math.random().toString(36).substring(2, 15);
}

async function parseLivePageToPortableText(url) {
  const response = await axios.get(url, { timeout: 10000 });
  const $ = cheerio.load(response.data);
  
  let contentArea = $('.entry-content');
  if (contentArea.find('.et_builder_inner_content').length > 0) {
    contentArea = contentArea.find('.et_builder_inner_content');
  }

  const blocks = [];
  
  // Find structural items in order of appearance
  const elements = contentArea.find('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, .et_pb_gallery, .gallery, .wp-block-gallery, iframe, video, img');
  
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const $el = $(el);
    const tagName = el.tagName.toLowerCase();
    
    // Skip nested elements to avoid double parsing
    if ($el.parents('blockquote, ul, ol, .et_pb_gallery, .gallery, .wp-block-gallery').length > 0) {
      continue;
    }
    
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      const text = $el.text().trim();
      if (text) {
        blocks.push({
          _key: generateKey(),
          _type: 'block',
          style: tagName === 'h2' ? 'h2' : tagName === 'h3' ? 'h3' : 'normal',
          children: [{ _key: generateKey(), _type: 'span', text }]
        });
      }
    } else if (tagName === 'blockquote') {
      const text = $el.text().trim();
      if (text) {
        blocks.push({
          _key: generateKey(),
          _type: 'block',
          style: 'blockquote',
          children: [{ _key: generateKey(), _type: 'span', text }]
        });
      }
    } else if (['ul', 'ol'].includes(tagName)) {
      const listType = tagName === 'ul' ? 'bullet' : 'number';
      $el.find('li').each((_, li) => {
        const text = $(li).text().trim();
        if (text) {
          blocks.push({
            _key: generateKey(),
            _type: 'block',
            style: 'normal',
            listItem: listType,
            children: [{ _key: generateKey(), _type: 'span', text }]
          });
        }
      });
    } else if ($el.hasClass('et_pb_gallery') || $el.hasClass('gallery') || $el.hasClass('wp-block-gallery')) {
      const images = [];
      $el.find('img, a').each((__, imgEl) => {
        const src = $(imgEl).attr('src') || $(imgEl).attr('href');
        if (src && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.includes('/wp-content/uploads/'))) {
          images.push(getCandidates(src)[0]);
        }
      });
      const uniqueUrls = Array.from(new Set(images));
      
      const galleryImages = [];
      for (const imgUrl of uniqueUrls) {
        galleryImages.push({
          _key: generateKey(),
          _type: 'image',
          // Simulate asset reference structure
          asset: { _type: 'reference', _ref: `simulated-asset-id-for-${path.basename(imgUrl)}` }
        });
      }
      
      if (galleryImages.length > 0) {
        blocks.push({
          _key: generateKey(),
          _type: 'gallery',
          images: galleryImages
        });
      }
    } else if (tagName === 'iframe' || tagName === 'video') {
      const src = $el.attr('src');
      if (src) {
        blocks.push({
          _key: generateKey(),
          _type: 'video',
          url: src
        });
      }
    } else if (tagName === 'img') {
      // Individual image outside of galleries
      const src = $el.attr('src');
      if (src) {
        blocks.push({
          _key: generateKey(),
          _type: 'image',
          asset: { _type: 'reference', _ref: `simulated-asset-id-for-${path.basename(src)}` }
        });
      }
    } else if (tagName === 'p') {
      // P Tag: extract text, and any inline images/videos that might not be captured otherwise
      const text = $el.text().trim();
      const inlineImgs = $el.find('img');
      
      if (inlineImgs.length > 0) {
        for (let j = 0; j < inlineImgs.length; j++) {
          const src = $(inlineImgs[j]).attr('src');
          if (src) {
            blocks.push({
              _key: generateKey(),
              _type: 'image',
              asset: { _type: 'reference', _ref: `simulated-asset-id-for-${path.basename(src)}` }
            });
          }
        }
      }
      
      if (text) {
        blocks.push({
          _key: generateKey(),
          _type: 'block',
          style: 'normal',
          children: [{ _key: generateKey(), _type: 'span', text }]
        });
      }
    }
  }

  return blocks;
}

async function run() {
  const url = 'https://la-montagne-guide.fr/grande-voie-ponteil/';
  const blocks = await parseLivePageToPortableText(url);
  console.log(`Parsed ${blocks.length} Portable Text blocks:`);
  console.log(JSON.stringify(blocks.slice(0, 8), null, 2));
}

run();
