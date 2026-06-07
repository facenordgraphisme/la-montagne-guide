const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = path.join(__dirname, '..', 'public', 'Articles-Export-2026-June-07-1655.csv');
const fileContent = fs.readFileSync(csvPath, 'utf8');
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

const post = records.find(r => r.Title.toLowerCase().includes('miage') || r.Content.toLowerCase().includes('miage-bionnassay'));
const index = records.findIndex(r => r.Title.toLowerCase().includes('miage') || r.Content.toLowerCase().includes('miage-bionnassay'));
if (post) {
  console.log("=== ARTICLE TROUVÉ ===");
  console.log("Index in CSV:", index);
  console.log("Title:", post.Title);
  console.log("Date:", post.Date);
  console.log("Image URL:", post['Image URL']);
} else {
  console.log("Article non trouvé.");
}
