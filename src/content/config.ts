import { defineCollection, z } from 'astro:content';

const recipes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    cyber_concept: z.string().optional(),
    prep_time: z.string().optional(),
    cook_time: z.string().optional(),
    total_time: z.string().optional(),
    servings: z.string().optional(),
    difficulty: z.enum(['easy', 'intermediate', 'advanced']).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    ingredients: z.array(z.string()).optional(),
    instructions: z.array(z.string()).optional(),
    custom_spice_blend: z.array(z.string()).optional(),
    aar: z.object({
      worked: z.string().optional(),
      adjust: z.string().optional(),
      lessons: z.string().optional(),
    }).optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { recipes, posts, guides };
