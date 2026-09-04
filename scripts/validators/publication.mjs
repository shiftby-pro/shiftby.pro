import { records, fail } from './common.mjs';

export function validatePublication() {
  const errors = [];
  for (const { file, data } of records()) {
    const published = ['published', 'updated', 'superseded'].includes(data.published_status);
    if (published) {
      if (data.visibility !== 'public' || data.indexing !== 'index' || data.release_approved !== true) errors.push(file + ': published record is not public/indexed/approved');
      if (!data.published_at) errors.push(file + ': published record has no published_at');
      if ((data.images?.evidence ?? []).length === 0 && !data.images?.evidence_exception) errors.push(file + ': published record lacks evidence or documented exception');
    }
  }
  fail(errors);
  return 'publication gates pass';
}
