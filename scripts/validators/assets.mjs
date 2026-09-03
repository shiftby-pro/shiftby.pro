import { records, existsPublicAsset, fail } from './common.mjs';

export function validateAssets() {
  const errors = [];
  for (const { file, data } of records()) {
    const images = [data.images?.representative, data.images?.social, ...(data.images?.evidence ?? [])];
    for (const image of images) {
      if (!image?.src || !image?.alt) errors.push(file + ': every image needs src and alt');
      if (image?.src && !existsPublicAsset(image.src)) errors.push(file + ': missing asset ' + image.src);
    }
    if (data.editorial_status === 'published' && (data.images?.evidence ?? []).length === 0 && !data.images?.evidence_exception) errors.push(file + ': published asset evidence gate missing');
  }
  fail(errors);
  return 'image roles and assets pass';
}
