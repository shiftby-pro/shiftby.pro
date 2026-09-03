import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export const root = process.cwd();
export const contentDir = path.join(root, 'src/content/fieldwork');
export const distDir = path.join(root, 'dist');
export const manifest = JSON.parse(fs.readFileSync(path.join(contentDir, 'publication-manifest.json'), 'utf8'));

export function contentFiles() {
  return fs.readdirSync(contentDir).filter((file) => /\.(md|mdx)$/.test(file));
}

export function readRecord(file) {
  const source = fs.readFileSync(path.join(contentDir, file), 'utf8');
  if (!source.startsWith('---')) throw new Error(file + ': missing frontmatter');
  const end = source.indexOf(String.fromCharCode(10) + '---', 3);
---', 3);
  if (end < 0) throw new Error(file + ': unterminated frontmatter');
  return { file, source, data: parse(source.slice(3, end)) };
}

export function records() {
  return contentFiles().map(readRecord);
}

export function publicRecords() {
  return records().filter(({ data }) => data.visibility === 'public');
}

export function publishedRecords() {
  return publicRecords().filter(({ data }) =>
    data.indexing === 'index' &&
    data.release_approved === true &&
    ['published', 'updated', 'superseded'].includes(data.published_status),
  );
}

export function isRedirectHtml(html) {
  return /<meta[^>]+http-equiv=["']refresh["']/i.test(html);
}

export function fail(errors) {
  if (errors.length) throw new Error(errors.map((error) => '- ' + error).join(String.fromCharCode(10)));
'));
}

export function existsPublicAsset(src) {
  return fs.existsSync(path.join(root, 'public', src.startsWith('/') ? src.slice(1) : src));
}
