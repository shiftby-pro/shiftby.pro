import { manifest, records, fail } from './common.mjs';

export function validatePublication() {
  const errors = [];
  for (const { file, data } of records()) {
    const published = ['published', 'updated', 'superseded'].includes(data.published_status);
    if (published) {
      if (data.visibility !== 'public' || data.indexing !== 'index' || data.release_approved !== true) errors.push(file + ': published record is not public/indexed/approved');
      if (!data.published_at) errors.push(file + ': published record has no published_at');
      if ((data.images?.evidence ?? []).length === 0 && !data.images?.evidence_exception) errors.push(file + ': published record lacks evidence or documented exception');
    }
    if (data.lcp_id === 'LCP-04' && (data.editorial_status !== 'review' || data.indexing !== 'noindex' || data.release_approved !== false || data.published_status !== 'not-published')) errors.push(file + ': LCP-04 review gate violated');
  }
  const manifest04 = manifest.records.find((entry) => entry.lcp_id === 'LCP-04');
  if (manifest04 && (manifest04.editorial_status !== 'review' || manifest04.indexing !== 'noindex' || manifest04.release_approved !== false)) errors.push('manifest: LCP-04 gate violated');
  fail(errors);
  return 'publication gates pass';
}
