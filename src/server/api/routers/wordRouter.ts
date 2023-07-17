import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const MeaningSchema = z.object({
  definition: z.string(),
  example: z.string().optional(),
});

const CategorySchema = z.object({
  name: z.string(),
  meanings: z.array(MeaningSchema),
});

const WordSchema = z.object({
  name: z.string(),
  createdById: z.string(),
  transcription: z.string(),
  categories: z.array(CategorySchema),
});

export const wordRouter = createTRPCRouter({
  createWord: protectedProcedure
    .input(WordSchema)
    .mutation(({ ctx, input }) => {
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
