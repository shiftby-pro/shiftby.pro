import { getCollection } from 'astro:content';
import { getFieldworkCanonicalPath, isPublishedIndexable } from '../lib/fieldwork';

export async function GET({ site }: { site: URL }) {
  const items = await getCollection('fieldwork', ({ data }) => isPublishedIndexable(data));
  const entries: Array<{ path: string; lastmod?: Date }> = [
    ...['/', '/projects/', '/projects/inspiral/', '/fieldwork/', '/projects/inspiral/fieldwork/', '/about/'].map((path) => ({ path })),
    ...items.map((item) => ({ path: getFieldworkCanonicalPath(item), lastmod: item.data.updated_at ?? item.data.published_at })),
  ];
  const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
  const urls = [...new Map(entries.map((entry) => [entry.path, entry])).values()]
    .map(({ path, lastmod }) => `  <url><loc>${escapeXml(new URL(path, site).toString())}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
