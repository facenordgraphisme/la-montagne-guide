require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@sanity/client');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-05-01',
  token,
  useCdn: false,
});

async function run() {
  console.log("=== Nettoyage des anciens articles Sanity (hors top 10) ===");

  const csvPath = path.join(__dirname, '..', 'public', 'Articles-Export-2026-June-07-1940.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const first10Ids = new Set();
  const top10 = records.slice(0, 10);
  top10.forEach((row, idx) => {
    const idKey = Object.keys(row).find(k => k.trim().replace(/^\uFEFF/i, '').toLowerCase() === 'id');
    const wpId = idKey ? row[idKey] : idx;
    first10Ids.add(`wp-post-${wpId}`);
  });

  console.log("IDs des 10 premiers articles à conserver :", Array.from(first10Ids));

  // Query all posts starting with wp-post-
  const query = `*[_type == "post" && _id match "wp-post-*"]{ _id, title }`;
  const wpPosts = await client.fetch(query);
  console.log(`Nombre total de posts WordPress trouvés dans Sanity : ${wpPosts.length}`);

  let deletedCount = 0;
  for (const post of wpPosts) {
    if (!first10Ids.has(post._id)) {
      console.log(`Suppression de : "${post.title}" (ID: ${post._id})`);
      await client.delete(post._id);
      deletedCount++;
    }
  }

  console.log(`Nettoyage terminé. ${deletedCount} articles supprimés.`);
}

run();
