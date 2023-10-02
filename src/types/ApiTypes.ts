import { z } from "zod";

export const MeaningSchema = z.object({
  id: z.string(),
  definition: z.string(),
  categoryId: z.string().nullable(),
  example: z.string().nullable(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  meanings: z.array(MeaningSchema),
  wordId: z.string().nullable(),
});

export const WordSchema = z.object({
  id: z.string(),
  name: z.string(),
  transcription: z.string(),
  synonyms: z.array(z.string()),
  language: z.string().nullable(),
  dictionary: z.string().nullable(),
  createdAt: z.coerce.date().nullable(),
  shareCode: z.string().nullable(),
  easinessFactor: z.number(),
  repetitions: z.number(),
  interval: z.coerce.date(),
  createdById: z.string().nullable(),
  categories: z.array(CategorySchema),
});

export type Word = z.infer<typeof WordSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Meaning = z.infer<typeof MeaningSchema>;
