const cheerio = require('cheerio');

function normalizeTitle(title) {
  if (!title) return '';
  // Decode HTML entities
  let text = cheerio.load(title).text() || title;
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    // Replace all dash-like characters (hyphen, en-dash, em-dash) and punctuation with space
    .replace(/[\-\u2010-\u2015]/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')     // Remove non-alphanumeric except spaces
    .replace(/\s+/g, ' ')           // Collapse multiple spaces
    .trim();
}

const csvTitle = "Raid à ski Ubaye - Val Maira - Val Varaita";
const wpTitle = "Raid à ski Ubaye &#8211; Val Maira &#8211; Val Varaita";

console.log("CSV normalized:", normalizeTitle(csvTitle));
console.log("WP normalized:", normalizeTitle(wpTitle));
console.log("Match?", normalizeTitle(csvTitle) === normalizeTitle(wpTitle));
