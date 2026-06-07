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
      status: e.response ? e.response.status : 'error',
      message: e.message
    };
  }
}

function getOriginalWpUrl(url) {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/(?:-e\d+)?-\d+x\d+(\.[a-zA-Z0-9]+)$/i, '$1');
  clean = clean.replace(/\.resized(\.[a-zA-Z0-9]+)$/i, '$1');
  return clean;
}

async function run() {
  const tests = [
    {
      thumb: 'https://la-montagne-guide.fr/wp-content/uploads/2011/02/photos_olan-123.resized-e1302861442380-225x300.jpg',
      options: [
        'https://la-montagne-guide.fr/wp-content/uploads/2011/02/photos_olan-123.resized.jpg',
        'https://la-montagne-guide.fr/wp-content/uploads/2011/02/photos_olan-123.jpg',
        'https://la-montagne-guide.fr/wp-content/uploads/2011/02/photos_olan-123-e1302861442380.jpg',
        'https://la-montagne-guide.fr/wp-content/uploads/2011/02/photos_olan-123.resized-e1302861442380.jpg',
      ]
    }
  ];

  for (const t of tests) {
    console.log(`\nThumb: ${t.thumb}`);
    const resThumb = await checkUrl(t.thumb);
    console.log(`Thumb Size: ${resThumb.size}`);

    for (const opt of t.options) {
      const resOpt = await checkUrl(opt);
      console.log(`Option URL: ${opt} -> Status: ${resOpt.status}, Size: ${resOpt.size}`);
    }
  }
}

run();
