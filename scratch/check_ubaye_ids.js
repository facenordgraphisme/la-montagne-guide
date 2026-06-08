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

const post2 = records[555]; // Raid à ski Ubaye
if (post2) {
  console.log("Image ID:", post2['Image ID']);
  console.log("Image URL:", post2['Image URL']);
  console.log("Image Alt Text:", post2['Image Alt Text']);
}
