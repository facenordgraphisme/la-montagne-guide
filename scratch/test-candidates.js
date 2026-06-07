const path = require('path');
const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function getCandidates(url) {
  const candidates = [];
  let cleanUrl = url.trim();
  if (cleanUrl.startsWith(',')) cleanUrl = cleanUrl.substring(1).trim();
  if (cleanUrl.endsWith(',')) cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1).trim();
  if (cleanUrl.startsWith('//')) cleanUrl = 'https:' + cleanUrl;

  const parsed = path.parse(cleanUrl);
  let name = parsed.name;
  
  let dimensions = null;
  const dimMatch = name.match(/-(\d+x\d+)$/);
  if (dimMatch) {
    dimensions = dimMatch[1];
    name = name.slice(0, -dimMatch[0].length);
  }

  let eSuffix = null;
  const eMatch = name.match(/-e(\d+)$/);
  if (eMatch) {
    eSuffix = eMatch[1];
    name = name.slice(0, -eMatch[0].length);
  }

  const dimMatch2 = name.match(/-(\d+x\d+)$/);
  if (dimMatch2) {
    dimensions = dimMatch2[1];
    name = name.slice(0, -dimMatch2[0].length);
  }

  let hasResized = false;
  if (name.endsWith('.resized')) {
    hasResized = true;
    name = name.slice(0, -'.resized'.length);
  }

  const buildUrl = (n, resized, e, dim) => {
    let baseName = n;
    if (resized) baseName += '.resized';
    if (e) baseName += `-e${e}`;
    if (dim) baseName += `-${dim}`;
    // Replace backslashes with forward slashes for Windows paths
    return `${parsed.dir}/${baseName}${parsed.ext}`.replace(/\\/g, '/');
  };

  candidates.push(buildUrl(name, false, null, null));
  if (hasResized) candidates.push(buildUrl(name, true, null, null));
  if (eSuffix) candidates.push(buildUrl(name, false, eSuffix, null));
  if (hasResized && eSuffix) candidates.push(buildUrl(name, true, eSuffix, null));
  if (dimensions) candidates.push(buildUrl(name, false, null, dimensions));
  if (hasResized && dimensions) candidates.push(buildUrl(name, true, null, dimensions));
  if (eSuffix && dimensions) candidates.push(buildUrl(name, false, eSuffix, dimensions));
  if (hasResized && eSuffix && dimensions) candidates.push(buildUrl(name, true, eSuffix, dimensions));
  candidates.push(cleanUrl);

  return Array.from(new Set(candidates));
}

async function checkUrl(url) {
  try {
    const res = await axios.head(url, { timeout: 3000 });
    return { status: res.status, size: parseInt(res.headers['content-length'] || '0') };
  } catch (e) {
    return { status: e.response ? e.response.status : 'error', size: 0 };
  }
}

async function run() {
  const url = 'https://la-montagne-guide.fr/wp-content/uploads/2011/02/photos_olan-123.resized-e1302861442380-225x300.jpg';
  const candidates = getCandidates(url);
  console.log("Candidates generated for:", url);
  console.log(candidates);

  for (const c of candidates) {
    const res = await checkUrl(c);
    console.log(`URL: ${c} -> Status: ${res.status}, Size: ${res.size}`);
  }
}

run();
