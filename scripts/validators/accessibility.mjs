import fs from 'node:fs';
import { distDir, fail, isRedirectHtml } from './common.mjs';

export function validateAccessibility() {
  const errors = [];
  const files = fs.existsSync(distDir) ? fs.readdirSync(distDir, { recursive: true }).filter((file) => String(file).endsWith('.html')) : [];
  for (const file of files) {
    const html = fs.readFileSync(distDir + '/' + file, 'utf8');
    if (isRedirectHtml(html)) continue;
    if (!/<html[^>]+lang="/i.test(html)) errors.push(file + ': missing language');
    for (const image of html.matchAll(/<img\b[^>]*>/gi)) if (!/\balt="/i.test(image[0])) errors.push(file + ': image missing alt');
    for (const table of html.matchAll(/<table\b[\s\S]*?<\/table>/gi)) if (!/<th\b/i.test(table[0])) errors.push(file + ': table missing header cells');
  }
  fail(errors);
  return files.length + ' HTML documents checked for baseline accessibility';
}
