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
  console.log(`\n=== POST 553: "${post1.Title}" ===`);
  const regex = /\[(?:et_pb_)?gallery[^\]]*\]/g;
  let match;
  while ((match = regex.exec(post1.Content)) !== null) {
    console.log("Found shortcode:", match[0]);
  }
}

if (post2) {
  console.log(`\n=== POST 555: "${post2.Title}" ===`);
  const regex = /\[(?:et_pb_)?gallery[^\]]*\]/g;
  let match;
  while ((match = regex.exec(post2.Content)) !== null) {
    console.log("Found shortcode:", match[0]);
  }
}
