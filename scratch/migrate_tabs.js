/**
 * Migration : copie les anciens champs programme/budget/infosPratiques/materiel
 * vers le nouveau champ tabs[] pour un séjour donné (par slug).
 *
 * Usage : node scratch/migrate_tabs.js
 * (le slug cible est défini dans TARGET_SLUG ci-dessous)
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

// ── Config ──────────────────────────────────────────────────────────────────

const TARGET_SLUG = 'stage-initiation-alpinisme-3-jours';

const TABS_MAP = [
  { legacyField: 'programme',     title: 'Programme',      titleEn: 'Programme' },
  { legacyField: 'budget',        title: 'Budget',         titleEn: 'Budget' },
  { legacyField: 'infosPratiques',title: 'Infos Pratiques',titleEn: 'Practical Info' },
  { legacyField: 'materiel',      title: 'Matériel',       titleEn: 'Equipment' },
];

// ── Env ──────────────────────────────────────────────────────────────────────

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) { console.error('.env not found'); process.exit(1); }

const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (m) {
    let v = m[2] || '';
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    env[m[1]] = v;
  }
});

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
        NEXT_PUBLIC_SANITY_DATASET: dataset,
        NEXT_PUBLIC_SANITY_API_VERSION: apiVersion = '2024-05-01',
        SANITY_API_TOKEN: token } = env;

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity env vars'); process.exit(1);
}

const base = `https://${projectId}.api.sanity.io/v${apiVersion}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function key() { return crypto.randomBytes(6).toString('hex'); }

async function query(q) {
  const r = await axios.get(`${base}/data/query/${dataset}?query=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${token}` } });
  return r.data.result;
}

async function mutate(mutations) {
  const r = await axios.post(`${base}/data/mutate/${dataset}`,
    { mutations },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
  return r.data;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\nFetching séjour with slug "${TARGET_SLUG}"…`);

  const docs = await query(
    `*[_type == "sejour" && slug.current == "${TARGET_SLUG}"]{
       _id, title,
       programme, budget, infosPratiques, materiel,
       tabs
     }`
  );

  if (!docs || docs.length === 0) {
    console.error('Séjour not found. Check TARGET_SLUG.'); process.exit(1);
  }

  // Operate on the published document (no "drafts." prefix)
  const published = docs.find(d => !d._id.startsWith('drafts.')) || docs[0];
  const draft     = docs.find(d =>  d._id.startsWith('drafts.'));

  console.log(`Found: "${published.title}" (${published._id})`);
  if (draft) console.log(`  Draft also found: ${draft._id}`);

  if (published.tabs && published.tabs.length > 0) {
    console.log(`\n⚠  This séjour already has ${published.tabs.length} tab(s) in the published version.`);
    console.log('   Aborting to avoid overwriting existing data. Remove this check if you want to force.');
    process.exit(0);
  }

  // Build tabs array from legacy fields
  const tabs = [];
  for (const { legacyField, title, titleEn } of TABS_MAP) {
    const content = published[legacyField];
    if (!content || !Array.isArray(content) || content.length === 0) {
      console.log(`  Skipping "${title}" — legacy field is empty.`);
      continue;
    }
    // Ensure each block has a _key
    const contentWithKeys = content.map(block => ({
      ...block,
      _key: block._key || key(),
    }));
    tabs.push({
      _type: 'sejourTab',
      _key: key(),
      title,
      titleEn,
      content: contentWithKeys,
    });
    console.log(`  ✓ "${title}" — ${content.length} block(s)`);
  }

  if (tabs.length === 0) {
    console.log('\nNo legacy content found to migrate. Nothing to do.');
    process.exit(0);
  }

  console.log(`\nWriting ${tabs.length} tab(s) to Sanity…`);

  const patchPublished = {
    patch: {
      id: published._id,
      set:   { tabs },
      unset: ['programme', 'budget', 'infosPratiques', 'materiel'],
    }
  };

  const mutations = [patchPublished];

  // Also patch the draft if one exists
  if (draft) {
    mutations.push({
      patch: {
        id: draft._id,
        set:   { tabs },
        unset: ['programme', 'budget', 'infosPratiques', 'materiel'],
      }
    });
    console.log('  (will also patch draft)');
  }

  const result = await mutate(mutations);
  console.log('\n✅ Migration complete!');
  console.log('Result:', JSON.stringify(result, null, 2));
}

run().catch(err => {
  console.error('\n❌ Migration failed:', err.response ? JSON.stringify(err.response.data) : err.message);
  process.exit(1);
});
