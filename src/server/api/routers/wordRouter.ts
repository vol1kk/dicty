import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const MeaningSchema = z.object({
  id: z.string().optional(),
  definition: z.string(),
  example: z.string().optional(),
});

const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  meanings: z.array(MeaningSchema),
  wordId: z.string().optional(),
});

const WordSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  transcription: z.string(),
  createdById: z.string(),
  categories: z.array(CategorySchema),
});

export const wordRouter = createTRPCRouter({
  createWord: protectedProcedure
    .input(WordSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.word.create({
        data: createWord(input, ctx.authedUser.id),
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

  updateWord: protectedProcedure
    .input(WordSchema)
    .mutation(async ({ ctx, input: updatedWord }) => {
      const existingWord = await ctx.prisma.word.findUnique({
        where: { id: updatedWord.id },
        include: { categories: { include: { meanings: true } } },
      });

      if (!existingWord) throw new TRPCError({ code: "NOT_FOUND" });

      if (existingWord.createdById !== updatedWord.createdById)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.prisma.word.delete({ where: { id: existingWord.id } });
      return ctx.prisma.word.create({
        data: createWord(updatedWord, ctx.authedUser.id),
      });
    }),
});

function createWord(data: z.infer<typeof WordSchema>, userId: string) {
  return {
    name: data.name,
    createdById: userId,
    transcription: data.transcription,
    categories: {
      create: data.categories.map(category => ({
        name: category.name,
        meanings: {
          create: category.meanings,
        },
      })),
    },
  };
}
