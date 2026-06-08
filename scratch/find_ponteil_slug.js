const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  const slug = 'grande-voie-ponteil';
  const url = `https://la-montagne-guide.fr/wp-json/wp/v2/posts?slug=${slug}`;
  console.log(`Querying: ${url}`);
  try {
    const response = await axios.get(url, { timeout: 10000 });
    console.log(`Results: ${response.data.length}`);
    if (response.data.length > 0) {
      const p = response.data[0];
      console.log(`Matched! ID: ${p.id}, Title: "${p.title.rendered}", Slug: "${p.slug}"`);
    } else {
      console.log("No exact slug match. Trying text search...");
      const searchUrl = `https://la-montagne-guide.fr/wp-json/wp/v2/posts?search=${encodeURIComponent(slug)}&per_page=10`;
      const searchResponse = await axios.get(searchUrl, { timeout: 10000 });
      console.log(`Search results: ${searchResponse.data.length}`);
      searchResponse.data.forEach(p => {
        console.log(`ID: ${p.id}, Title: "${p.title.rendered}", Slug: "${p.slug}"`);
      });
    }
  } catch (e) {
    console.error(e.message);
  }
}
run();
