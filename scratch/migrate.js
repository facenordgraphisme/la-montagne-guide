const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Parse .env manually
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error(".env file not found at " + envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-01';
const token = env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing required Sanity environment variables in .env");
  process.exit(1);
}

const sanityUrl = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
  console.log("Fetching activities from Sanity...");
  const query = encodeURIComponent('*[_type == "activity"]{ _id, title, "slug": slug.current, type }');
  const activitiesRes = await axios.get(`${sanityUrl}/data/query/${dataset}?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const activities = activitiesRes.data.result;
  console.log("Found activities:", activities.map(a => `${a.title} (${a.type} / ${a.slug}) -> ${a._id}`));

  const activityMap = {};
  activities.forEach(act => {
    if (act.type) activityMap[act.type] = act._id;
    if (act.slug) activityMap[act.slug] = act._id;
  });

  console.log("Fetching posts that have activityType defined...");
  const postQuery = encodeURIComponent('*[_type == "post" && defined(activityType)]{ _id, title, activityType }');
  const postsRes = await axios.get(`${sanityUrl}/data/query/${dataset}?query=${postQuery}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const allPosts = postsRes.data.result;
  const posts = allPosts.filter(p => typeof p.activityType === 'string');
  console.log(`Found ${posts.length} posts with string activityType to migrate.`);

  if (posts.length === 0) {
    console.log("Nothing to migrate.");
    return;
  }

  const mutations = [];
  for (const post of posts) {
    const stringVal = post.activityType;
    let targetId = activityMap[stringVal];
    if (!targetId) {
      if (stringVal === 'ski') targetId = activityMap['ski-de-randonnee'] || activityMap['ski'];
    }

    if (targetId) {
      console.log(`Post: "${post.title}" (${stringVal} -> ref ${targetId})`);
      mutations.push({
        patch: {
          id: post._id,
          set: {
            activityType: {
              _type: 'reference',
              _ref: targetId
            }
          }
        }
      });
    } else {
      console.warn(`WARNING: No activity found for "${stringVal}" in post "${post.title}" (${post._id})`);
    }
  }

  if (mutations.length > 0) {
    console.log(`Sending ${mutations.length} patches to Sanity...`);
    const mutateRes = await axios.post(`${sanityUrl}/data/mutate/${dataset}`, 
      { mutations },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    console.log("Mutations result:", mutateRes.data);
    console.log("Migration successfully complete!");
  } else {
    console.log("No mutations to apply.");
  }
}

run().catch(err => {
  console.error("Migration failed:", err.response ? err.response.data : err.message);
});
