import { manifest, records, fail } from './common.mjs';

export function validateContracts() {
  const errors = [];
  const required = ['lcp_id','content_id','title','slug','canonical_url','description','format','project','editorial_status','published_status','visibility','indexing','release_approved','seo_title','seo_description','images'];
  const all = records();
  const seen = new Set();
  for (const { file, data } of all) {
    for (const field of required) if (data[field] === undefined || data[field] === null || data[field] === '') errors.push(file + ': missing ' + field);
    if (seen.has(data.lcp_id)) errors.push(file + ': duplicate ' + data.lcp_id);
    seen.add(data.lcp_id);
    const expected = manifest.records.find((entry) => entry.lcp_id === data.lcp_id);
    if (!expected) {
      errors.push(file + ': absent from publication manifest');
      continue;
    }
    const checks = {
      content_id: data.content_id, title: data.title, format: data.format, project: data.project,
      canonical_url: data.canonical_url, editorial_status: data.editorial_status,
      published_status: data.published_status, visibility: data.visibility, indexing: data.indexing,
      release_approved: data.release_approved, seo_title: data.seo_title,
      seo_description: data.seo_description,
      representative_image: data.images?.representative?.src,
      social_image: data.images?.social?.src,
    };
    for (const [field, value] of Object.entries(checks)) {
      if (JSON.stringify(value) !== JSON.stringify(expected[field])) errors.push(file + ': ' + field + ' disagrees with manifest');
    }
    if (data.slug !== data.canonical_url.split('/').filter(Boolean).at(-1)) errors.push(file + ': slug/canonical mismatch');
    if (!/^\/[^ ]+\/$/.test(data.canonical_url)) errors.push(file + ': canonical_url must be site-relative and end with /');
    if (data.seo_title.length > 70) errors.push(file + ': seo_title exceeds 70 characters');
    if (data.seo_description.length > 170) errors.push(file + ': seo_description exceeds 170 characters');
  }
  for (const entry of manifest.records) if (!all.some(({ data }) => data.lcp_id === entry.lcp_id)) errors.push('manifest missing content file for ' + entry.lcp_id);
  fail(errors);
  return all.length + ' records reconciled';
}
