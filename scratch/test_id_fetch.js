const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test(id) {
  const url = `https://la-montagne-guide.fr/wp-json/wp/v2/posts/${id}`;
  console.log(`Fetching by ID: ${url}`);
  try {
    const response = await axios.get(url, { timeout: 10000 });
    console.log(`Status: ${response.status}`);
    console.log(`Title: "${response.data.title.rendered}"`);
    console.log(`Slug: "${response.data.slug}"`);
  } catch (e) {
    console.error(`Error for ID ${id}: ${e.message}`);
  }
}

async function run() {
  await test(19580); // Ubaye
  await test(19346); // Mont Rose (one of the IDs)
}
run();
