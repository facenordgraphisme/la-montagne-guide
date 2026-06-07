require('dotenv').config();
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
  const query = `*[_type == "post"] | order(publishedAt desc)[0...10] {
    title,
    "mainImageUrl": mainImage.asset->url,
    "mainImageMeta": mainImage.asset->metadata,
    body
  }`;
  
  const posts = await client.fetch(query);
  posts.forEach((post, i) => {
    console.log(`\nPost ${i + 1}: ${post.title}`);
    console.log(`Main Image URL: ${post.mainImageUrl}`);
    if (post.mainImageMeta && post.mainImageMeta.dimensions) {
      console.log(`Main Image Dimensions: ${post.mainImageMeta.dimensions.width}x${post.mainImageMeta.dimensions.height}`);
    }
    
    // Body images
    if (post.body) {
      post.body.forEach((block, bi) => {
        if (block._type === 'image') {
          console.log(`- Body Image Block ${bi}`);
        } else if (block._type === 'gallery') {
          console.log(`- Gallery Block ${bi} with ${block.images ? block.images.length : 0} images`);
        }
      });
    }
  });
}

run();
