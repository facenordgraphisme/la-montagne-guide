const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = path.join(__dirname, '..', 'public', 'Articles-Export-2026-June-07-1940.csv');
const fileContent = fs.readFileSync(csvPath, 'utf8');
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

console.log("Column names:", Object.keys(records[0]));
// Let's print the first 5 records' titles and slugs if there's any slug field
const slugKey = Object.keys(records[0]).find(k => k.toLowerCase().includes('slug') || k.toLowerCase().includes('permalink') || k.toLowerCase().includes('lien'));
console.log("Found slug/link key:", slugKey);
if (slugKey) {
  for (let i = 0; i < 5; i++) {
    console.log(`Title: "${records[i].Title}" | Slug/Link: "${records[i][slugKey]}"`);
  }
}
