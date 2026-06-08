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

const post1 = records[553]; // 4000m du Mont-Rose
const post2 = records[555]; // Raid à ski Ubaye - Val Maira - Val Varaita

if (post1) {
  const urls = post1['Image URL'] ? post1['Image URL'].split(/[|,]/).map(u => u.trim()).filter(Boolean) : [];
  console.log(`Post 553 ("${post1.Title}"): Image URL count = ${urls.length}`);
  console.log(`First 3:`, urls.slice(0, 3));
}

if (post2) {
  const urls = post2['Image URL'] ? post2['Image URL'].split(/[|,]/).map(u => u.trim()).filter(Boolean) : [];
  console.log(`Post 555 ("${post2.Title}"): Image URL count = ${urls.length}`);
  console.log(`First 3:`, urls.slice(0, 3));
}
