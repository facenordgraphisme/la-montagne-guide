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

const post = records[561]; // Grimpe au Ponteil
if (post) {
  console.log("Title:", post.Title);
  console.log("Image ID:", post['Image ID']);
  console.log("Image URL:", post['Image URL']);
}
