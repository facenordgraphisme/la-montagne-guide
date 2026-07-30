import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export function getVanityImageUrl(url: string, filename?: string) {
  if (!url) return '';
  if (!filename) return url;
  
  // Slugify filename
  const slug = filename
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
    
  if (!slug) return url;
  
  // Split URL and query params
  const [cleanUrl, query] = url.split('?');
  
  // Get extension from original URL
  const extMatch = cleanUrl.match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? extMatch[0] : '';
  
  const vanityUrl = `${cleanUrl}/${slug}${ext}`;
  return query ? `${vanityUrl}?${query}` : vanityUrl;
}
