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
    format: z.enum(['analysis', 'case-study', 'guide', 'technical-note', 'research-note', 'project-update', 'opinion']),
    content_role: z.enum(['canonical', 'companion', 'adaptation']),
    project: z.string().min(1),
    work_domains: z.array(z.string().min(1)).min(1),
    author: z.string().min(1),
    visibility: z.enum(['public', 'unlisted', 'private']),
    editorial_status: z.enum(['draft', 'review', 'validation', 'ready', 'published', 'superseded']),
    body_authority: z.enum(['notion', 'git']),
    published_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
});

export const collections = { fieldwork };
