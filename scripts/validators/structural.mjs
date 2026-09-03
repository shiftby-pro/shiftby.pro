import fs from 'node:fs';
import path from 'node:path';
import { distDir, fail } from './common.mjs';

function htmlFiles() {
  if (!fs.existsSync(distDir)) return [];
  const result = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const target = path.join(dir, name);
      if (fs.statSync(target).isDirectory()) walk(target);
      else if (name.endsWith('.html')) result.push(target);
    }
  }
  walk(distDir);
  return result;
}
export function validateStructural() {
  const files = htmlFiles();
  fail(files.length ? [] : ['dist contains no generated HTML']);
  const errors = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    if (!/^<!doctype html>/i.test(html.trim())) errors.push(file + ': missing doctype');
    if (!/<html[^>]+lang="/i.test(html)) errors.push(file + ': missing html lang');
    if (!/<main\b/i.test(html)) errors.push(file + ': missing main landmark');
    if ((html.match(/<h1\b/gi) ?? []).length !== 1) errors.push(file + ': must contain exactly one h1');
  }
  fail(errors);
  return files.length + ' generated HTML files checked';
}
