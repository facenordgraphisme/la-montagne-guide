const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Helper: Slugify title
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '')    // Remove invalid chars
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/-+/g, '-');           // Remove duplicate -
}

async function getActualWordPressSlug(title, cleanSlug) {
  try {
    const searchUrl = `https://la-montagne-guide.fr/wp-json/wp/v2/posts?search=${encodeURIComponent(title)}&per_page=3`;
    console.log(`Searching WP API: ${searchUrl}`);
    const response = await axios.get(searchUrl, { timeout: 6000 });
    if (response.status === 200 && response.data && response.data.length > 0) {
      console.log(`WP API returned ${response.data.length} results.`);
      const lowerTitle = title.toLowerCase().trim();
      const bestMatch = response.data.find(post => {
        const postTitle = (post.title && post.title.rendered) ? post.title.rendered.toLowerCase().trim() : '';
        return postTitle === lowerTitle || postTitle.includes(lowerTitle) || lowerTitle.includes(postTitle);
      });
      if (bestMatch && bestMatch.slug) {
        console.log(`[REST API Slug Match] Match: "${bestMatch.title.rendered}" -> ${bestMatch.slug}`);
        return bestMatch.slug;
      }
      console.log(`No exact match. First result: "${response.data[0].title.rendered}" -> ${response.data[0].slug}`);
      return response.data[0].slug;
    }
    console.log(`WP API returned no results.`);
  } catch (err) {
    console.log(`[REST API Slug Discovery] Error: ${err.message}`);
  }
  return cleanSlug;
}

async function test(title) {
  console.log(`\nTesting for title: "${title}"`);
  const cleanSlug = slugify(title);
  console.log(`cleanSlug: ${cleanSlug}`);
  const actualSlug = await getActualWordPressSlug(title, cleanSlug);
  console.log(`actualSlug: ${actualSlug}`);
  
  const liveUrl = `https://la-montagne-guide.fr/${actualSlug}/`;
  console.log(`Fetching live URL: ${liveUrl}`);
  try {
    const response = await axios.get(liveUrl, { timeout: 8000 });
    console.log(`HTTP Status: ${response.status}`);
    const $ = cheerio.load(response.data);
    const galleries = $('.et_pb_gallery, .gallery, .wp-block-gallery');
    console.log(`Galleries found on page: ${galleries.length}`);
  } catch (e) {
    console.log(`Fetch Error: ${e.message}`);
  }
}

async function run() {
  await test("4000m du Mont-Rose");
  await test("Raid à ski Ubaye - Val Maira - Val Varaita");
}

run();
