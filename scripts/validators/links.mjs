import fs from 'node:fs';
import path from 'node:path';
import { distDir, fail } from './common.mjs';

function outputPath(href) {
  const clean = href.split(/[?#]/)[0];
  if (!clean.startsWith('/') || clean.startsWith('//')) return null;
  const relative = clean.replace(/^\//, '').replace(/\/$/, '');
  return path.join(distDir, relative || 'index.html');
}
export function validateLinks() {
  const errors = [];
  const files = fs.existsSync(distDir) ? fs.readdirSync(distDir, { recursive: true }).filter((file) => String(file).endsWith('.html')) : [];
  for (const file of files) {
    const html = fs.readFileSync(distDir + '/' + file, 'utf8');
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
      const target = outputPath(match[1]);
      if (target && !fs.existsSync(target) && !fs.existsSync(target + '.html')) errors.push(String(file) + ': broken local reference ' + match[1]);
    }
  }
  fail(errors);
  return 'local links and assets resolve';
}
