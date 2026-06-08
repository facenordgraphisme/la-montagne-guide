const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { parse } = require('csv-parse/sync');

// Disable TLS verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testPost(slug, titleKeyword) {
  console.log(`\n===========================================`);
  console.log(`TESTING POST: ${slug} (${titleKeyword})`);
  console.log(`===========================================`);

  // 1. Search in CSV
  const csvPath = path.join(__dirname, '..', 'public', 'Articles-Export-2026-June-07-1940.csv');
  if (fs.existsSync(csvPath)) {
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    const row = records.find(r => r.Title.toLowerCase().includes(titleKeyword.toLowerCase()) || r.Slug === slug);
    if (row) {
      console.log(`Found in CSV! Title: "${row.Title}"`);
      // Find shortcodes
      const shortcodes = [];
      const regex = /\[(?:et_pb_)?gallery[^\]]*\]/g;
      let match;
      while ((match = regex.exec(row.Content)) !== null) {
        shortcodes.push(match[0]);
      }
      console.log(`Shortcodes in CSV Content:`, shortcodes);
    } else {
      console.log(`Not found in CSV by slug "${slug}" or title keyword "${titleKeyword}".`);
    }
  }

  // 2. Fetch live page
  const liveUrl = `https://la-montagne-guide.fr/${slug}/`;
  console.log(`Fetching live URL: ${liveUrl}`);
  try {
    const response = await axios.get(liveUrl, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    
    console.log(`Galleries found on page:`);
    const galleries = $('.et_pb_gallery, .gallery, .wp-block-gallery');
    console.log(`Count: ${galleries.length}`);
    
    galleries.each((i, galleryEl) => {
      console.log(`\n--- Gallery #${i + 1} ---`);
      console.log(`Classes: ${$(galleryEl).attr('class')}`);
      
      const images = [];
      $(galleryEl).find('img, a').each((__, imgEl) => {
        const src = $(imgEl).attr('src') || $(imgEl).attr('href');
        if (src) {
          images.push(src.trim());
        }
      });
      console.log(`Total sub-elements with src/href: ${images.length}`);
      console.log(`First few srcs:`, images.slice(0, 5));
    });

  } catch (err) {
    console.error(`Error fetching: ${err.message}`);
  }
}

async function run() {
  await testPost('4000-mont-rose', 'rose');
  await testPost('raid-ski-ubaye-val-maira-varaita', 'ubaye');
}

run();
