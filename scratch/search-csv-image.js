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

console.log("Searching CSV...");
const query1 = '20200605_125852';
const query2 = '19807';

records.forEach((row, i) => {
  for (const [key, value] of Object.entries(row)) {
    if (value && (value.includes(query1) || value.includes(query2))) {
      console.log(`Found in row ${i} (${row.Title}), key: ${key}`);
      console.log(`Value: ${value.substring(0, 200)}...`);
    }
  }
});
