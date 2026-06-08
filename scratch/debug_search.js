const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  const title = "Raid à ski Ubaye - Val Maira - Val Varaita";
  const searchUrl = `https://la-montagne-guide.fr/wp-json/wp/v2/posts?search=${encodeURIComponent(title)}&per_page=10`;
  console.log(`URL: ${searchUrl}`);
  try {
    const response = await axios.get(searchUrl, { timeout: 10000 });
    console.log(`Status: ${response.status}`);
    console.log(`Count: ${response.data.length}`);
    response.data.forEach((p, idx) => {
      console.log(`[${idx}] ID: ${p.id}, Title: "${p.title.rendered}", Slug: "${p.slug}"`);
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
