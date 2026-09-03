export function GET() {
  return new Response('User-agent: *\nAllow: /\nSitemap: https://www.shiftby.pro/sitemap.xml\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
