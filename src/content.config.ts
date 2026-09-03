import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  bodyAuthorities, contentRoles, currentStatuses, editorialPurposes, editorialStatuses, formats, indexingStates,
  practiceAreas, projects, publishedStatuses, series, themes, visibilityStates,
} from './lib/content-taxonomy';

const imageAsset = z.object({
  src: z.string().regex(/^\/images\/[a-z0-9/_-]+\.(png|webp|svg)$/),
  alt: z.string().min(1),
});

const fieldwork = defineCollection({
  loader: glob({ pattern: '**/*.(md|mdx)', base: './src/content/fieldwork' }),
  schema: z.object({
    content_id: z.string().regex(/^SBP-CNT-\d{4}$/),
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().min(1),
    featured_statement: z.string().min(1).optional(),
    editorial_purpose: z.enum(editorialPurposes),
    format: z.enum(formats),
    content_role: z.enum(contentRoles),
    series: z.enum(series),
    project: z.enum(projects).optional(),
    practice_area: z.enum(practiceAreas),
    work_domains: z.array(z.string().min(1)).min(1),
    subjects: z.array(z.string().min(1)).min(1),
    primary_audience: z.string().min(1),
    secondary_audiences: z.array(z.string().min(1)).optional(),
    themes: z.array(z.enum(themes)).min(1),
    author: z.string().min(1),
    visibility: z.enum(visibilityStates),
    editorial_status: z.enum(editorialStatuses),
    body_authority: z.enum(bodyAuthorities),
    editorial_brief_url: z.url().optional(),
    current_status: z.enum(currentStatuses),
    published_status: z.enum(publishedStatuses),
    indexing: z.enum(indexingStates),
    seo_title: z.string().min(1).optional(),
    seo_description: z.string().min(1).optional(),
    images: z.object({
      representative: imageAsset,
      evidence: z.array(imageAsset).default([]),
      evidence_exception: z.string().min(1).optional(),
      social: imageAsset,
    }).superRefine((images, ctx) => {
      if (images.evidence.length === 0 && !images.evidence_exception) {
        ctx.addIssue({ code: 'custom', path: ['evidence'], message: 'Provide evidence images or record an exceptional text-led reason.' });
      }
      if (images.evidence.length > 0 && images.evidence_exception) {
        ctx.addIssue({ code: 'custom', path: ['evidence_exception'], message: 'Remove the exception when evidence images are provided.' });
      }
    }),
    published_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
});

export const collections = { fieldwork };
