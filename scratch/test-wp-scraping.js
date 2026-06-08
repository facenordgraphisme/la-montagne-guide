const axios = require('axios');
const cheerio = require('cheerio');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  const url = 'https://la-montagne-guide.fr/raid-ski-vanoise/';
  console.log(`Scraping: ${url}`);
  try {
    const res = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(res.data);
    
    // Find featured image meta
    const ogImage = $('meta[property="og:image"]').attr('content');
    console.log("Featured Image (og:image):", ogImage);

    // Find all images inside the main article/content area
    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('logo') && !src.includes('avatar')) {
        images.push(src);
      }
    });

    console.log("Images found:", images.length);
    console.log(images.slice(0, 5));

    // Find all links to images
    const imageLinks = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && (href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.png'))) {
        imageLinks.push(href);
      }
    });
    console.log("Image links found:", imageLinks.length);

    // Find all video iframe links or video tags
    console.log("=== ALL IFRAMES AND VIDEOS ===");
    $('iframe').each((i, el) => {
      console.log(`Iframe ${i}: src="${$(el).attr('src')}" parent="${$(el).parent().attr('class') || $(el).parent().prop('tagName')}"`);
    });
    $('video').each((i, el) => {
      console.log(`Video ${i}: src="${$(el).attr('src') || $(el).find('source').attr('src')}"`);
    });

  } catch (e) {
    console.error("Error scraping:", e.message);
  }
}

run();
