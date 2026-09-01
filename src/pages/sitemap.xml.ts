import { getCollection } from 'astro:content';

export async function GET({ site }: { site: URL }) {
  const items = await getCollection('fieldwork', ({ data }) => data.visibility === 'public');
  const paths = ['/', '/projects/', '/projects/inspiral/', '/fieldwork/', '/about/', ...items.map((item) => `/fieldwork/${item.data.slug}/`)];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site).toString()}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
