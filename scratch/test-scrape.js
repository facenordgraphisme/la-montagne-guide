const axios = require('axios');
const cheerio = require('cheerio');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const url = 'https://la-montagne-guide.fr/raid-ski-thabor/';
  console.log('Fetching', url);
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  
  console.log('--- GALLERIES ON PAGE ---');
  $('.et_pb_gallery').each((idx, el) => {
    console.log(`\nGallery #${idx + 1}:`);
    const images = [];
    $(el).find('.et_pb_gallery_image img, a').each((_, imgEl) => {
      const src = $(imgEl).attr('src') || $(imgEl).attr('href');
      if (src && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png'))) {
        images.push(src);
      }
    });
    console.log('Images:', Array.from(new Set(images)));
  });
}

test();
