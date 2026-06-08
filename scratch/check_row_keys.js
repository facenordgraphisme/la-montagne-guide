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

const post1 = records[553];
console.log("Keys in CSV row:", Object.keys(post1));
console.log("Values for 553:");
for (let key in post1) {
  if (key !== 'Content') {
    console.log(`${key}: ${JSON.stringify(post1[key])}`);
  }
}
