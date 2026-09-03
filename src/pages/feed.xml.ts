import { getCollection } from 'astro:content';
import { getFieldworkCanonicalPath, isPublishedIndexable, sortFieldworkByPublication } from '../lib/fieldwork';

const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export async function GET({ site }: { site: URL }) {
  const items = sortFieldworkByPublication(await getCollection('fieldwork', ({ data }) => isPublishedIndexable(data)));
  const entries = items.map((item) => {
    const url = new URL(getFieldworkCanonicalPath(item), site).href;
    const date = item.data.updated_at ?? item.data.published_at;
    return `    <item><title>${escapeXml(item.data.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(item.data.description)}</description>${date ? `<pubDate>${date.toUTCString()}</pubDate>` : ''}</item>`;
  }).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Shiftby.pro Fieldwork</title><link>${escapeXml(new URL('/fieldwork/', site).href)}</link><description>Independent, evidence-bounded notes on AI-assisted research, systems and practice.</description>${entries}\n  </channel></rss>`, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
