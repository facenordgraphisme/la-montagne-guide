const axios = require('axios');
const cheerio = require('cheerio');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  const url = 'https://la-montagne-guide.fr/raid-ski-thabor/';
  try {
    const res = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(res.data);
    
    // Print all img tags with their classes and parent structures
    console.log("=== ALL IMAGES ON THE PAGE ===");
    $('img').each((i, el) => {
      console.log(`Img ${i}: src="${$(el).attr('src')}" classes="${$(el).attr('class')}" parent="${$(el).parent().attr('class') || $(el).parent().prop('tagName')}"`);
    });

    console.log("\n=== Meta Tags ===");
    $('meta').each((i, el) => {
      const name = $(el).attr('name') || $(el).attr('property');
      const content = $(el).attr('content');
      if (name && name.includes('image')) {
        console.log(`Meta property="${name}" content="${content}"`);
      }
    });

  } catch (e) {
    console.error(e.message);
  }
}

run();
