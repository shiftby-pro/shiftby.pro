import type { CollectionEntry } from 'astro:content';
import { isPublishedIndexable } from './content-taxonomy';

export type FieldworkEntry = CollectionEntry<'fieldwork'>;

export { isPublishedIndexable };

export function getFieldworkCanonicalPath(item: Pick<FieldworkEntry, 'data'>): string {
  if (item.data.project === 'inspiral') return `/projects/inspiral/fieldwork/${item.data.slug}/`;
  if (item.data.project === 'ai-security-assurance') return `/projects/ai-security-assurance/fieldwork/${item.data.slug}/`;
  return `/fieldwork/${item.data.slug}/`;
}

export function getSeriesName(item: Pick<FieldworkEntry, 'data'>): string {
  return item.data.series === 'inspiral-fieldwork' ? 'Inspiral Fieldwork' : 'Shiftby.pro Fieldwork';
}

export function sortFieldworkByPublication(items: FieldworkEntry[]): FieldworkEntry[] {
  return [...items].sort((a, b) => (b.data.published_at?.getTime() ?? 0) - (a.data.published_at?.getTime() ?? 0) || b.id.localeCompare(a.id));
}
