
import { z } from 'zod';
import { MAX_CHARACTERS } from './constants';

export const PageCreateSchema = z.object({
  page_id: z.string().min(1),
  content: z.string().min(1).max(MAX_CHARACTERS),
  theme: z.string().optional(),
  private: z.boolean().optional(),
});

export const PageEditSchema = z.object({
  page_id: z.string().min(1),
  content: z.string().min(1).max(MAX_CHARACTERS),
});
