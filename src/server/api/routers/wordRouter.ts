import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const meanings = {
  meaning: z.string(),
  exampleSentences: z.string().array(),
  categoryId: z.string(),
};

const categories = {
  name: z.string(),
  meanings: z.object(meanings).array(),
  synonyms: z.string().array(),
};

const word = z.object({
  userId: z.string(),
  name: z.string(),
  transcription: z.string(),
  categories: z.object(categories).array(),
});

export const wordRouter = createTRPCRouter({
  createWord: protectedProcedure.input(word).mutation(({ ctx, input }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.prisma.word.create({
      data: {
        name: input.name,
        transcription: input.transcription,
        userId: input.userId,
        categories: {
          create: input.categories.map(category => ({
            name: category.name,
            synonyms: category.synonyms,
            meanings: {
              create: category.meanings.map(meaning => ({
                meaning: meaning.meaning,
                exampleSentences: meaning.exampleSentences,
              })),
            },
          })),
        },
      },
    });
  }),
});
