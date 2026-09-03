import type { CollectionEntry } from 'astro:content';
import { isPublishedIndexable, isReadyToPublish } from './content-taxonomy';

export type FieldworkEntry = CollectionEntry<'fieldwork'>;

export { isPublishedIndexable, isReadyToPublish };

export function getFieldworkCanonicalPath(item: Pick<FieldworkEntry, 'data'>): string {
  return item.data.canonical_url;
}

export function getSeriesName(item: Pick<FieldworkEntry, 'data'>): string {
  return item.data.series === 'inspiral-fieldwork' ? 'Inspiral Fieldwork' : 'Shiftby.pro Fieldwork';
}

export function sortFieldworkByPublication(items: FieldworkEntry[]): FieldworkEntry[] {
  return [...items].sort((a, b) => (b.data.published_at?.getTime() ?? 0) - (a.data.published_at?.getTime() ?? 0) || b.id.localeCompare(a.id));
}
