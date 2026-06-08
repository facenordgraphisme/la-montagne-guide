const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const title = "4000m du Mont-Rose";
  const searchUrl = `https://la-montagne-guide.fr/wp-json/wp/v2/posts?search=${encodeURIComponent(title)}`;
  console.log("Fetching search api:", searchUrl);
  try {
    const res = await axios.get(searchUrl);
    console.log("Status:", res.status);
    console.log("Posts found:", res.data.length);
    if (res.data && res.data.length > 0) {
      console.log("Post 1 Link:", res.data[0].link);
      console.log("Post 1 Slug:", res.data[0].slug);
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
