/** Controlled publication vocabulary. Keep these values stable once used in URLs or metadata. */
export const editorialPurposes = ['analyze', 'explain', 'document', 'teach', 'report', 'reflect'] as const;
export const formats = ['analysis', 'method', 'case-study', 'guide', 'technical-note', 'research-note', 'project-update', 'opinion'] as const;
export const contentRoles = ['canonical', 'companion', 'adaptation'] as const;
export const series = ['inspiral-fieldwork', 'shiftby-pro-fieldwork'] as const;
export const projects = ['inspiral', 'ai-security-assurance'] as const;
export const practiceAreas = [
  'ai-assisted-work',
  'business-analysis-process-design',
  'product-strategy',
  'product-service-design',
  'enterprise-architecture',
  'software-engineering',
  'data-knowledge-systems',
  'testing-evaluation-validation',
  'cybersecurity',
  'governance-risk-assurance',
  'operations-delivery',
  'content-communication',
  'adoption-transformation',
  'sustainability',
  'research-development',
  'ai-operations',
] as const;
export const themes = ['ai-assisted-work', 'knowledge-systems', 'data-quality', 'governance', 'evidence-and-lineage', 'execution'] as const;
export const visibilityStates = ['public', 'unlisted', 'private'] as const;
export const editorialStatuses = ['draft', 'review', 'validation', 'ready', 'published', 'superseded'] as const;
export const publishedStatuses = ['not-published', 'preview', 'published', 'updated', 'superseded', 'archived'] as const;
export const currentStatuses = ['current', 'historical', 'mixed-qualified', 'unknown-verify', 'superseded'] as const;
export const indexingStates = ['index', 'noindex'] as const;
export const bodyAuthorities = ['notion', 'git'] as const;

export const publicationLabels = {
  practiceAreas: Object.fromEntries(practiceAreas.map((value) => [value, value.replaceAll('-', ' ')])) as Record<string, string>,
  formats: Object.fromEntries(formats.map((value) => [value, value.replaceAll('-', ' ')])) as Record<string, string>,
};

export function isPublishedIndexable(data: { visibility: string; published_status: string; indexing: string }): boolean {
  return data.visibility === 'public' && data.indexing === 'index' && ['published', 'updated', 'superseded'].includes(data.published_status);
}
