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

const p3 = records.find(r => r.Title.includes("Raid ski Vanoise"));
if (p3) {
  // Find all [et_pb_video ...] and [embed ...] shortcodes
  const matches = p3.Content.match(/\[(et_pb_video|embed)[^\]]*\]([\s\S]*?)\[\/\1\]|\[(et_pb_video|embed)[^\]]*\]/g);
  console.log("Found video shortcodes:", matches);
}
