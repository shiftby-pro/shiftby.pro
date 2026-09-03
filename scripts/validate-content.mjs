import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const root = process.cwd();
const contentDir = path.join(root, 'src/content/fieldwork');
const manifest = JSON.parse(fs.readFileSync(path.join(contentDir, 'publication-manifest.json'), 'utf8'));
const files = fs.readdirSync(contentDir).filter((file) => /\\.(md|mdx)$/.test(file));
const errors = [];

const readRecord = (file) => {
  const text = fs.readFileSync(path.join(contentDir, file), 'utf8');
  if (!text.startsWith('---')) {
    errors.push(`${file}: missing frontmatter`);
    return null;
  }
  const end = text.indexOf('\\n---', 3);
  if (end < 0) {
    errors.push(`${file}: unterminated frontmatter`);
    return null;
  }
  try {
    return { data: parse(text.slice(3, end)), file };
  } catch (error) {
    errors.push(`${file}: invalid YAML (${error.message})`);
    return null;
  }
};

const records = files.map(readRecord).filter(Boolean);
const byId = new Map(manifest.records.map((record) => [record.lcp_id, record]));
const required = ['lcp_id', 'content_id', 'title', 'slug', 'format', 'project', 'canonical_url', 'editorial_status', 'published_status', 'visibility', 'indexing', 'release_approved', 'seo_title', 'seo_description', 'images'];

if (new Set(manifest.records.map((record) => record.lcp_id)).size !== manifest.records.length) {
  errors.push('publication-manifest.json: duplicate lcp_id');
}

for (const { data, file } of records) {
  for (const field of required) if (data[field] === undefined || data[field] === null || data[field] === '') errors.push(`${file}: missing required field ${field}`);
  const expected = byId.get(data.lcp_id);
  if (!expected) {
    errors.push(`${file}: ${data.lcp_id} is missing from publication-manifest.json`);
    continue;
  }
  const checks = {
    content_id: data.content_id,
    title: data.title,
    format: data.format,
    project: data.project,
    canonical_url: data.canonical_url,
    editorial_status: data.editorial_status,
    published_status: data.published_status,
    visibility: data.visibility,
    indexing: data.indexing,
    release_approved: data.release_approved,
    seo_title: data.seo_title,
    seo_description: data.seo_description,
    representative_image: data.images?.representative?.src,
    social_image: data.images?.social?.src
  };
  for (const [field, value] of Object.entries(checks)) {
    if (JSON.stringify(value) !== JSON.stringify(expected[field])) errors.push(`${file}: ${field} disagrees with table projection (${JSON.stringify(value)} !== ${JSON.stringify(expected[field])})`);
  }
  if (data.slug !== data.canonical_url.split('/').filter(Boolean).at(-1)) errors.push(`${file}: slug does not match canonical_url`);
  if (!/^\\/[^ ]+\\/$/.test(data.canonical_url)) errors.push(`${file}: canonical_url must be a site-relative path ending in /`);
  if (data.seo_title.length > 70) errors.push(`${file}: seo_title exceeds 70 characters`);
  if (data.seo_description.length > 170) errors.push(`${file}: seo_description exceeds 170 characters`);
  for (const image of [data.images?.representative, data.images?.social, ...(data.images?.evidence ?? [])]) {
    if (!image?.src || !image?.alt) errors.push(`${file}: every image must have src and alt`);
    if (image?.src && !fs.existsSync(path.join(root, 'public', image.src.replace(/^\\//, '')))) errors.push(`${file}: missing image asset ${image.src}`);
  }
  const publishable = data.editorial_status === 'published' || data.published_status === 'published' || data.published_status === 'updated';
  if (publishable) {
    if (data.visibility !== 'public' || data.indexing !== 'index' || data.release_approved !== true) errors.push(`${file}: published content must be public, indexable and approved`);
    if (!data.published_at) errors.push(`${file}: published content requires published_at`);
    if ((data.images?.evidence ?? []).length === 0 && !data.images?.evidence_exception) errors.push(`${file}: published content requires evidence images or a documented exception`);
  }
  if (data.lcp_id === 'LCP-04') {
    if (data.editorial_status !== 'review' || data.indexing !== 'noindex' || data.release_approved !== false) errors.push(`${file}: LCP-04 must remain review/noindex/unapproved`);
  }
}
for (const entry of manifest.records) {
  if (!records.some(({ data }) => data.lcp_id === entry.lcp_id)) errors.push(`publication-manifest.json: missing content file for ${entry.lcp_id}`);
}
if (errors.length) {
  console.error(['Content validation failed:', ...errors.map((error) => `- ${error}`)].join('\\n'));
  process.exit(1);
}
console.log(`Content validation passed: ${records.length} records checked against ${manifest.records.length} table records.`);
