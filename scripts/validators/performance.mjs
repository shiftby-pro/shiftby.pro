import fs from 'node:fs';
import path from 'node:path';
import { distDir, fail } from './common.mjs';

export function validatePerformance() {
  const errors = [];
  const files = fs.existsSync(distDir) ? fs.readdirSync(distDir, { recursive: true }).filter((file) => String(file).endsWith('.html')) : [];
  for (const file of files) {
    const target = path.join(distDir, String(file));
    const bytes = fs.statSync(target).size;
    if (bytes > 150 * 1024) errors.push(String(file) + ': HTML exceeds 150 KB budget');
  }
  const assets = fs.existsSync(distDir) ? fs.readdirSync(path.join(distDir, '_astro'), { recursive: true }).filter((file) => /\.(js|css)$/.test(String(file))) : [];
  const jsBytes = assets.reduce((sum, file) => sum + fs.statSync(path.join(distDir, '_astro', String(file))).size, 0);
  if (jsBytes > 75 * 1024) errors.push('page JavaScript exceeds 75 KB budget');
  fail(errors);
  return 'HTML and JavaScript budgets pass';
}
