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

console.log("Colums:", Object.keys(records[0]));
for (let i = 0; i < 10; i++) {
  console.log(`\n--- Article ${i} ---`);
  console.log("Title:", records[i].Title);
  console.log("Image URL:", records[i]['Image URL']);
  console.log("Excerpt:", records[i].Excerpt ? records[i].Excerpt.substring(0, 100) : 'none');
  // Check images inside Content
  const content = records[i].Content;
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  const imgs = [];
  while ((match = imgRegex.exec(content)) !== null) {
    imgs.push(match[1]);
  }
  console.log("Nested images:", imgs);
}
