import { z } from "zod";

export const MeaningSchema = z.object({
  id: z.string(),
  definition: z.string().trim(),
  categoryId: z.string().nullable(),
  example: z.string().trim().nullable(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().trim(),
  meanings: z.array(MeaningSchema),
  wordId: z.string().nullable(),
});

export const WordSchema = z.object({
  id: z.string(),
  name: z.string().trim(),
  transcription: z.string().trim(),
  synonyms: z.array(z.string()),
  language: z.string().trim().nullable(),
  dictionary: z.string().trim().nullable(),
  createdAt: z.coerce.date().nullable(),
  shareCode: z.string().trim().nullable(),
  easinessFactor: z.number(),
  repetitions: z.number(),
  interval: z.coerce.date(),
  createdById: z.string().nullable(),
  categories: z.array(CategorySchema),
});

export type Word = z.infer<typeof WordSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Meaning = z.infer<typeof MeaningSchema>;
