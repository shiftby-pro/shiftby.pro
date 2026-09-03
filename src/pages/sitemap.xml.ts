import { getCollection } from 'astro:content';
import { getFieldworkCanonicalPath } from '../lib/fieldwork';

export async function GET({ site }: { site: URL }) {
  const items = await getCollection('fieldwork', ({ data }) => data.visibility === 'public' && data.indexing === 'index');
  const paths = [...new Set([
    '/',
    '/projects/',
    '/projects/inspiral/',
    '/fieldwork/',
    '/projects/inspiral/fieldwork/',
    '/about/',
    ...items.map(getFieldworkCanonicalPath),
  ])];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site).toString()}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
