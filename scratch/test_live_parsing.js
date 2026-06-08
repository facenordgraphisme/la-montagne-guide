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

async function testLiveParsing(url) {
  console.log(`\n===========================================`);
  console.log(`Parsing live URL: ${url}`);
  console.log(`===========================================`);

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    
    // In Divi theme, the main content is usually inside .entry-content or .et_builder_inner_content
    let contentArea = $('.entry-content');
    if (contentArea.find('.et_builder_inner_content').length > 0) {
      contentArea = contentArea.find('.et_builder_inner_content');
    }
    
    console.log("Content area found. Parsing children...");
    
    // We will find all paragraphs, galleries, headers, videos, etc. in order
    // Let's traverse all elements that contain content
    const blocks = [];
    
    // A selector that gets main structural children in order of appearance
    // et_pb_row contains text blocks or galleries. Let's find all rows, or directly search within the entry-content
    contentArea.find('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, .et_pb_gallery, .gallery, .wp-block-gallery, iframe, video').each((i, el) => {
      const $el = $(el);
      const tagName = el.tagName.toLowerCase();
      
      // Prevent double parsing if elements are nested (e.g. p inside blockquote or li inside ul)
      if ($el.parents('blockquote, ul, ol, .et_pb_gallery, .gallery, .wp-block-gallery').length > 0) {
        return;
      }
      
      if (tagName === 'p') {
        const text = $el.text().trim();
        // Check for images inside paragraph
        const imgs = $el.find('img');
        if (imgs.length > 0) {
          console.log(`[P Block #${i}] Found ${imgs.length} inline images.`);
          imgs.each((_, img) => {
            const src = $(img).attr('src');
            console.log(`  -> Image: ${src}`);
          });
        }
        if (text) {
          console.log(`[P Block #${i}] Text: "${text.substring(0, 60)}..."`);
        }
      } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        console.log(`[Header #${i}] ${tagName.toUpperCase()}: "${$el.text().trim()}"`);
      } else if (tagName === 'blockquote') {
        console.log(`[Blockquote #${i}]: "${$el.text().trim()}"`);
      } else if (['ul', 'ol'].includes(tagName)) {
        console.log(`[List #${i}] Type: ${tagName}, Items: ${$el.find('li').length}`);
      } else if ($el.hasClass('et_pb_gallery') || $el.hasClass('gallery') || $el.hasClass('wp-block-gallery')) {
        const images = [];
        $el.find('img, a').each((__, imgEl) => {
          const src = $(imgEl).attr('src') || $(imgEl).attr('href');
          if (src && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.includes('/wp-content/uploads/'))) {
            images.push(getCandidates(src)[0]);
          }
        });
        const unique = Array.from(new Set(images));
        console.log(`[Gallery Block #${i}] Found gallery with ${unique.length} unique images. First few:`, unique.slice(0, 3));
      } else if (tagName === 'iframe' || tagName === 'video') {
        console.log(`[Video/Iframe #${i}] Src: ${$el.attr('src')}`);
      }
    });

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function run() {
  await testLiveParsing('https://la-montagne-guide.fr/grande-voie-ponteil/');
  await testLiveParsing('https://la-montagne-guide.fr/4000-mont-rose/');
}

run();
