import { manifest, records, fail } from './common.mjs';

export function validateIA() {
  const errors = [];
  const paths = new Set();
  for (const { file, data } of records()) {
    if (paths.has(data.canonical_url)) errors.push(file + ': duplicate canonical route ' + data.canonical_url);
    paths.add(data.canonical_url);
    if (data.project === 'inspiral' && !data.canonical_url.startsWith('/projects/inspiral/fieldwork/')) errors.push(file + ': Inspiral route outside project fieldwork IA');
    const entry = manifest.records.find((item) => item.lcp_id === data.lcp_id);
    if (entry && entry.canonical_url !== data.canonical_url) errors.push(file + ': route differs from manifest');
  }
  fail(errors);
  return paths.size + ' canonical routes checked';
}
