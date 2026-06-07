const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function checkUrl(url) {
  try {
    const res = await axios.head(url, { timeout: 5000 });
    return {
      status: res.status,
      size: res.headers['content-length']
    };
  } catch (e) {
    return {
      status: e.response ? e.response.status : 'error'
    };
  }
}

async function run() {
  const images = [
    'https://la-montagne-guide.fr/wp-content/uploads/2011/09/P1080495.jpg',
    'https://la-montagne-guide.fr/wp-content/uploads/2011/09/P1080509-e1316342608761.jpg',
    'https://la-montagne-guide.fr/wp-content/uploads/2011/09/P1080509.jpg'
  ];

  for (const img of images) {
    const res = await checkUrl(img);
    console.log(`URL: ${img} -> Status: ${res.status}, Size: ${res.size}`);
  }
}

run();
