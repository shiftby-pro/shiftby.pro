import fs from 'node:fs';
import { distDir, fail, isRedirectHtml } from './common.mjs';

export function validateStructuredData() {
  const errors = [];
  if (!fs.existsSync(distDir)) errors.push('dist directory missing');
  const files = fs.existsSync(distDir) ? fs.readdirSync(distDir, { recursive: true }).filter((file) => String(file).endsWith('.html')) : [];
  for (const file of files) {
    const html = fs.readFileSync(distDir + '/' + file, 'utf8');
    if (isRedirectHtml(html) || /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) continue;
    const matches = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
    if (!matches.length) { errors.push(file + ': missing JSON-LD'); continue; }
    for (const match of matches) {
      try {
        const json = JSON.parse(match[1].replaceAll('&amp;', '&'));
        const graph = json['@graph'] ?? [json];
        if (!graph.some((item) => ['WebPage','AboutPage','Article','CollectionPage','WebSite'].includes(item['@type']))) errors.push(file + ': JSON-LD missing page type');
        if (graph.some((item) => item['@type'] === 'Article' && (!item.headline || !item.author || !item.mainEntityOfPage))) errors.push(file + ': Article JSON-LD missing headline/author/mainEntityOfPage');
        if (graph.some((item) => item['@type'] === 'BreadcrumbList' && !Array.isArray(item.itemListElement))) errors.push(file + ': invalid BreadcrumbList');
      } catch (error) { errors.push(file + ': invalid JSON-LD: ' + error.message); }
    }
  }
  fail(errors);
  return files.length + ' HTML documents with structured data checked';
}
