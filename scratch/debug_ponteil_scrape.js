const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
  } catch (err) {
    // Fail-safe
  }

  candidates.push(cleanUrl);
  return Array.from(new Set(candidates));
}

async function run() {
  const url = 'https://la-montagne-guide.fr/grande-voie-ponteil/';
  console.log(`Fetching: ${url}`);
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    
    const galleries = $('.et_pb_gallery, .gallery, .wp-block-gallery');
    console.log(`Galleries found: ${galleries.length}`);
    
    galleries.each((i, galleryEl) => {
      console.log(`\n--- Gallery #${i + 1} ---`);
      const imgElements = $(galleryEl).find('img, a');
      console.log(`img/a elements inside gallery: ${imgElements.length}`);
      
      const galleryUrls = [];
      imgElements.each((__, imgEl) => {
        const src = $(imgEl).attr('src') || $(imgEl).attr('href');
        if (src) {
          galleryUrls.push(src.trim());
        }
      });
      console.log(`All raw href/src found:`, galleryUrls);
      
      // Deduplicate urls and pick original high-res candidates
      const uniqueUrls = [];
      const seen = new Set();
      for (const url of galleryUrls) {
        if (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.includes('/wp-content/uploads/'))) {
          let cleanSrc = url.trim();
          if (cleanSrc.startsWith('//')) cleanSrc = 'https:' + cleanSrc;
          const candidates = getCandidates(cleanSrc);
          const originalUrl = candidates[0];
          if (!seen.has(originalUrl)) {
            seen.add(originalUrl);
            uniqueUrls.push(originalUrl);
          }
        }
      }
      console.log(`Unique high-res urls found:`, uniqueUrls);
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
