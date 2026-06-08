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

const p1 = records.find(r => r.Title.includes("Mixte et varappe"));
const p2 = records.find(r => r.Title.includes("Raid ski Thabor"));
const p3 = records.find(r => r.Title.includes("Raid ski Vanoise"));

function printPost(p) {
  if (!p) return;
  console.log(`\n=== TITLE: ${p.Title} ===`);
  console.log("Image URL Column:", p['Image URL']);
  console.log("Content Shortcodes:");
  // Extract all shortcodes like [et_pb_...] or [embed...] or [gallery...]
  const matches = p.Content.match(/\[[^\]]+\]/g);
  console.log(matches ? matches : "No shortcodes");
}

printPost(p1);
printPost(p2);
printPost(p3);
