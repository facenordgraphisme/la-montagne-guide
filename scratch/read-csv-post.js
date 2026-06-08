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

const post = records.find(r => r.Title.includes('Thabor'));
if (post) {
  console.log("Image URL:", post['Image URL']);
  console.log("Content:", post.Content);
} else {
  console.log("Post not found.");
}
