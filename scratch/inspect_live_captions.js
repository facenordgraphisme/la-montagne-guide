const axios = require('axios');
const cheerio = require('cheerio');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  const url = 'https://la-montagne-guide.fr/calanques-futurs-croulants-branlants/';
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    
    // Find all images and print their parent tags and classes, along with any text that could be a caption
    $('.entry-content img').each((i, imgEl) => {
      const $img = $(imgEl);
      console.log(`\n--- Image #${i + 1} ---`);
      console.log(`Src: ${$img.attr('src')}`);
      console.log(`Parent Tag: ${imgEl.parentNode.tagName}`);
      console.log(`Parent Classes: ${$(imgEl.parentNode).attr('class')}`);
      
      // Look for a sibling or parent caption element
      const wpCaption = $img.closest('.wp-caption');
      if (wpCaption.length > 0) {
        console.log(`Found .wp-caption parent! Text: "${wpCaption.find('.wp-caption-text').text().trim()}"`);
      }
      
      const figure = $img.closest('figure');
      if (figure.length > 0) {
        console.log(`Found figure parent! Figcaption: "${figure.find('figcaption').text().trim()}"`);
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
