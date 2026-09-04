import fs from 'node:fs';
import { distDir, publishedRecords, fail, isRedirectHtml } from './common.mjs';

function files() {
  return fs.existsSync(distDir) ? fs.readdirSync(distDir, { recursive: true }).filter((file) => String(file).endsWith('.html')).map((file) => String(file)) : [];
}
export function validateSEO() {
  const errors = [];
  if (!fs.existsSync(distDir)) errors.push('dist directory missing');
  const htmlFiles = files();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(distDir + '/' + file, 'utf8');
    if (isRedirectHtml(html)) continue;
    if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(file + ': missing title');
    if (!/<meta name="description" content="[^"]+"/i.test(html)) errors.push(file + ': missing description');
    if (!/<link rel="canonical" href="https?:\/\/[^"]+"/i.test(html)) errors.push(file + ': missing absolute canonical');
    if (!/<meta property="og:title" content="[^"]+"/i.test(html)) errors.push(file + ': missing og:title');
    if (!/<meta property="og:description" content="[^"]+"/i.test(html)) errors.push(file + ': missing og:description');
    if (!/<meta property="og:url" content="https?:\/\/[^"]+"/i.test(html)) errors.push(file + ': missing absolute og:url');
    if (!/<meta name="twitter:card" content="[^"]+"/i.test(html)) errors.push(file + ': missing twitter:card');
    if (!/<meta name="twitter:title" content="[^"]+"/i.test(html)) errors.push(file + ': missing twitter:title');
    if (!/<meta name="twitter:description" content="[^"]+"/i.test(html)) errors.push(file + ': missing twitter:description');
    if (!/<link rel="icon" href="\/favicon\.svg"/i.test(html)) errors.push(file + ': missing favicon');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/i)?.[1];
    if (canonical && ogUrl && canonical !== ogUrl) errors.push(file + ': canonical and og:url differ');
  }
  const sitemap = fs.existsSync(distDir + '/sitemap.xml') ? fs.readFileSync(distDir + '/sitemap.xml', 'utf8') : '';
  const feed = fs.existsSync(distDir + '/feed.xml') ? fs.readFileSync(distDir + '/feed.xml', 'utf8') : '';
  if (!sitemap) errors.push('missing sitemap.xml');
  if (!feed) errors.push('missing feed.xml');
  for (const item of publishedRecords()) {
    if (!sitemap.includes(item.data.canonical_url)) errors.push('published route absent from sitemap: ' + item.data.canonical_url);
    if (!feed.includes(item.data.canonical_url)) errors.push('published route absent from RSS: ' + item.data.canonical_url);
  }
  fail(errors);
  return htmlFiles.length + ' HTML documents and discovery outputs checked';
}
