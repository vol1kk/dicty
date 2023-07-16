import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const meanings = {
  definition: z.string(),
  example: z.string(),
  categoryId: z.string(),
};

const categories = {
  name: z.string(),
  meanings: z.object(meanings).array(),
};

const word = z.object({
  userId: z.string(),
  name: z.string(),
  transcription: z.string(),
  categories: z.object(categories).array(),
});

export const wordRouter = createTRPCRouter({
  createWord: protectedProcedure.input(word).mutation(({ ctx, input }) => {
    return ctx.prisma.word.create({
      data: {
        name: input.name,
        createdById: input.userId,
        transcription: input.transcription,
        categories: {
          create: input.categories.map(category => ({
            name: category.name,
            meanings: {
              create: category.meanings.map(meaning => ({
                definition: meaning.definition,
                example: meaning.example,
              })),
            },
          })),
        },
      },
    });
  }),
});
