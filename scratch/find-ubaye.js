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

const matches = records.filter(r => r.Title.toLowerCase().includes('ubaye') || r.Content.toLowerCase().includes('ubaye'));
matches.forEach((m, idx) => {
  console.log(`Match #${idx+1}: Title="${m.Title}" | Date="${m.Date}"`);
});
