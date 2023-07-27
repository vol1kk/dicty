import { z } from "zod";

export const MeaningSchema = z.object({
  id: z.string(),
  definition: z.string(),
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
  shareCode: z.string().nullable(),
  createdById: z.string().nullable(),
  categories: z.array(CategorySchema),
});

export type Word = z.infer<typeof WordSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Meaning = z.infer<typeof MeaningSchema>;
