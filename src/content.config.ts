import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const fieldwork = defineCollection({
  loader: glob({ pattern: '**/*.(md|mdx)', base: './src/content/fieldwork' }),
  schema: z.object({
    content_id: z.string().regex(/^SBP-CNT-\d{4}$/),
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().min(1),
    featured_statement: z.string().min(1).optional(),
    format: z.enum(['analysis', 'method', 'case-study', 'guide', 'technical-note', 'research-note', 'project-update', 'opinion']),
    content_role: z.enum(['canonical', 'companion', 'adaptation']),
    series: z.enum(['inspiral-fieldwork', 'shiftby-pro-fieldwork']),
    project: z.enum(['inspiral', 'ai-security-assurance']).optional(),
    work_domains: z.array(z.string().min(1)).min(1),
    themes: z.array(z.enum(['ai-assisted-work', 'knowledge-systems', 'data-quality', 'governance', 'evidence-and-lineage', 'execution'])).min(1),
    author: z.string().min(1),
    visibility: z.enum(['public', 'unlisted', 'private']),
    editorial_status: z.enum(['draft', 'review', 'validation', 'ready', 'published', 'superseded']),
    body_authority: z.enum(['notion', 'git']),
    editorial_brief_url: z.url().optional(),
    current_status: z.enum(['current', 'historical', 'mixed-qualified', 'unknown-verify', 'superseded']),
    published_status: z.enum(['not-published', 'preview', 'published', 'updated', 'superseded', 'archived']),
    indexing: z.enum(['index', 'noindex']),
    seo_title: z.string().min(1).optional(),
    seo_description: z.string().min(1).optional(),
    social_image: z.string().regex(/^\/images\/[a-z0-9/_-]+\.png$/),
    social_image_alt: z.string().min(1),
    published_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
});

export const collections = { fieldwork };
