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

console.log("Searching for 'ubaye'...");
records.forEach((r, idx) => {
  if (r.Title.toLowerCase().includes('ubaye') || r.Content.toLowerCase().includes('ubaye')) {
    console.log(`Index: ${idx}, ID: ${r.ID || r.id || idx}, Title: "${r.Title}", Slug: "${r.Slug || r.slug}", Content Length: ${r.Content.length}`);
  }
});

console.log("\nSearching for 'mont rose' or '4000'...");
records.forEach((r, idx) => {
  if (r.Title.toLowerCase().includes('rose') || r.Content.toLowerCase().includes('rose')) {
    console.log(`Index: ${idx}, ID: ${r.ID || r.id || idx}, Title: "${r.Title}", Slug: "${r.Slug || r.slug}", Content Length: ${r.Content.length}`);
  }
});
