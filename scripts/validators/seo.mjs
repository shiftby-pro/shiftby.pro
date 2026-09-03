import fs from 'node:fs';
import { distDir, publishedRecords, fail } from './common.mjs';

function files() {
  return fs.existsSync(distDir) ? fs.readdirSync(distDir, { recursive: true }).filter((file) => String(file).endsWith('.html')).map((file) => String(file)) : [];
}
export function validateSEO() {
  const errors = [];
  if (!fs.existsSync(distDir)) errors.push('dist directory missing');
  const htmlFiles = files();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(distDir + '/' + file, 'utf8');
    if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(file + ': missing title');
    if (!/<meta name="description" content="[^"]+"/i.test(html)) errors.push(file + ': missing description');
    if (!/<link rel="canonical" href="https?:\/\/[^"]+"/i.test(html)) errors.push(file + ': missing absolute canonical');
    if (!/<meta property="og:title" content="[^"]+"/i.test(html)) errors.push(file + ': missing og:title');
    if (!/<meta name="twitter:card" content="[^"]+"/i.test(html)) errors.push(file + ': missing twitter:card');
  }
  const sitemap = fs.existsSync(distDir + '/sitemap.xml') ? fs.readFileSync(distDir + '/sitemap.xml', 'utf8') : '';
  const feed = fs.existsSync(distDir + '/feed.xml') ? fs.readFileSync(distDir + '/feed.xml', 'utf8') : '';
  if (!sitemap) errors.push('missing sitemap.xml');
  if (!feed) errors.push('missing feed.xml');
  for (const item of publishedRecords()) {
    if (!sitemap.includes(item.data.canonical_url)) errors.push('published route absent from sitemap: ' + item.data.canonical_url);
    if (!feed.includes(item.data.canonical_url)) errors.push('published route absent from RSS: ' + item.data.canonical_url);
  }
  if (sitemap.includes('/what-contextcore-currently-contains/')) errors.push('LCP-04 present in sitemap');
  if (feed.includes('/what-contextcore-currently-contains/')) errors.push('LCP-04 present in RSS');
  fail(errors);
  return htmlFiles.length + ' HTML documents and discovery outputs checked';
}
