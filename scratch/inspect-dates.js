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

for (let i = 0; i < 5; i++) {
  console.log(`Title: "${records[i].Title}" | Date raw: "${records[i].Date}" | parsed ISO: "${new Date(records[i].Date).toISOString()}"`);
}
