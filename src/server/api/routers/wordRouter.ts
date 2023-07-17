import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const meaning = z.object({
  definition: z.string(),
  example: z.string().optional(),
});

const category = z.object({
  name: z.string(),
  meanings: z.array(meaning),
});

const word = z.object({
  createdById: z.string(),
  name: z.string(),
  transcription: z.string(),
  categories: z.array(category),
});

export const wordRouter = createTRPCRouter({
  createWord: protectedProcedure.input(word).mutation(({ ctx, input }) => {
    return ctx.prisma.word.create({
      data: {
        name: input.name,
        createdById: ctx.authedUser.id,
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

  getWords: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany({
      where: { createdById: ctx.authedUser.id },
      include: { categories: { include: { meanings: true } } },
    });
  }),

  deleteWord: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.word.deleteMany({
        where: { createdById: ctx.authedUser.id, id: input.id },
      });
    }),
});
