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

const post1 = records.find(r => r.Title.toLowerCase().includes('rose') || r.Slug === '4000-mont-rose');
const post2 = records.find(r => r.Title.toLowerCase().includes('ubaye') || r.Slug === 'raid-ski-ubaye-val-maira-varaita');

if (post1) {
  console.log("\n=== POST 1 (rose) Content ===");
  console.log(post1.Content);
}

if (post2) {
  console.log("\n=== POST 2 (ubaye) Content ===");
  console.log(post2.Content);
}
