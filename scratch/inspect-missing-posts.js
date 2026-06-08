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

if (p1) {
  console.log("\n=== MIXTE ET VARAPPE ===");
  console.log("Image URL:", p1['Image URL']);
  console.log("Content:", p1.Content);
}
if (p2) {
  console.log("\n=== RAID SKI THABOR ===");
  console.log("Image URL:", p2['Image URL']);
  console.log("Content:", p2.Content);
}
if (p3) {
  console.log("\n=== RAID SKI VANOISE ===");
  console.log("Content:", p3.Content);
}
