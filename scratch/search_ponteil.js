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

console.log("Searching for 'ponteil'...");
records.forEach((r, idx) => {
  if (r.Title.toLowerCase().includes('ponteil') || r.Content.toLowerCase().includes('ponteil')) {
    console.log(`Index: ${idx}, ID: ${r.id || r['﻿id'] || idx}, Title: "${r.Title}", Date: ${r.Date}`);
    
    // Find shortcodes
    const shortcodes = [];
    const regex = /\[(?:et_pb_)?gallery[^\]]*\]/g;
    let match;
    while ((match = regex.exec(r.Content)) !== null) {
      shortcodes.push(match[0]);
    }
    console.log(`Shortcodes:`, shortcodes);
  }
});
