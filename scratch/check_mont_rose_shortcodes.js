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

const post1 = records[553]; // 4000m du Mont-Rose
if (post1) {
  const shortcodes = [];
  const regex = /\[(?:et_pb_)?gallery[^\]]*\]/g;
  let match;
  while ((match = regex.exec(post1.Content)) !== null) {
    shortcodes.push(match[0]);
  }
  console.log("CSV shortcodes count:", shortcodes.length);
  shortcodes.forEach((s, idx) => {
    // Check if it has gallery_ids attribute
    const idsMatch = s.match(/gallery_ids="([^"]*)"/);
    if (idsMatch) {
      console.log(`Shortcode #${idx + 1} has ${idsMatch[1].split(',').length} IDs: ${idsMatch[1].substring(0, 40)}...`);
    } else {
      console.log(`Shortcode #${idx + 1} has NO gallery_ids:`, s.substring(0, 100));
    }
  });
}
