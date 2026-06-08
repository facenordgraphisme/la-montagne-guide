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

records.sort((a, b) => {
  const timeA = a.Date ? new Date(a.Date).getTime() : 0;
  const timeB = b.Date ? new Date(b.Date).getTime() : 0;
  return timeB - timeA;
});

const idx1 = records.findIndex(r => r.Title.includes('4000m du Mont-Rose'));
const idx2 = records.findIndex(r => r.Title.includes('Raid à ski Ubaye - Val Maira - Val Varaita'));

if (idx1 !== -1) {
  console.log(`"4000m du Mont-Rose" sorted index: ${idx1}, Date: ${records[idx1].Date}`);
} else {
  console.log(`"4000m du Mont-Rose" not found in sorted list.`);
}

if (idx2 !== -1) {
  console.log(`"Raid à ski Ubaye - Val Maira - Val Varaita" sorted index: ${idx2}, Date: ${records[idx2].Date}`);
} else {
  console.log(`"Raid à ski Ubaye - Val Maira - Val Varaita" not found in sorted list.`);
}
