import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type Category,
  type Meaning,
  type Word,
  WordSchema,
} from "~/types/ApiTypes";
import { nanoid } from "nanoid";

export const wordRouter = createTRPCRouter({
  createWord: protectedProcedure
    .input(WordSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.word.create({
        data: createWord(input, ctx.authedUser.id),
      });
    }),

  generateShareCode: protectedProcedure
    .input(z.object({ wordId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingWord = await ctx.prisma.word.findUnique({
        where: { id: input.wordId },
      });

      if (!existingWord) throw new TRPCError({ code: "NOT_FOUND" });

      if (existingWord.createdById !== ctx.authedUser.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      return ctx.prisma.word.update({
        where: { id: input.wordId },
        data: { shareCode: nanoid() },
      });
    }),

  deleteShareCode: protectedProcedure
    .input(z.object({ wordId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingWord = await ctx.prisma.word.findUnique({
        where: { id: input.wordId },
      });

      if (!existingWord) throw new TRPCError({ code: "NOT_FOUND" });

      if (existingWord.createdById !== ctx.authedUser.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      return ctx.prisma.word.update({
        where: { id: input.wordId },
        data: { shareCode: null },
      });
    }),

  importWords: protectedProcedure
    .input(WordSchema.array())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async tx => {
        const words = input.map(w => ({
          where: { id: w.id },
          create: createWord(w),
        }));

        const existingWords = await ctx.prisma.word.findMany({
          where: { createdById: ctx.authedUser.id },
        });

        return tx.user.update({
          where: { id: ctx.authedUser.id },
          data: {
            words: {
              connectOrCreate: words,
              deleteMany: existingWords.map(w => ({
                id: w.id,
              })),
            },
          },
        });
      });
    }),

  getWords: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany({
      where: { createdById: ctx.authedUser.id },
      include: { categories: { include: { meanings: true } } },
      orderBy: { createdAt: "desc" },
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

      const deleted = getDeletedItems(
        existingWord.categories,
        updatedWord.categories,
      );

      const updatedCategories = updatedWord.categories.map(category => {
        const existingCategory = existingWord.categories.find(
          c => c.id === category.id,
        );

        const updatedMeanings = category.meanings.map(meaning => {
          const existingMeaning = existingCategory?.meanings.find(
            m => m.id === meaning.id,
          );

          return {
            where: {
              id:
                existingMeaning?.id === undefined
                  ? "NOT_FOUND"
                  : existingMeaning.id,
            },
            update: {
              definition: meaning.definition,
              example: meaning.example,
            },
            create: {
              ...createMeaning(meaning),
            },
          };
        });

        return {
          where: {
            id:
              existingCategory?.id === undefined
                ? "NOT_FOUND"
                : existingCategory.id,
          },
          update: {
            name: category.name,
            meanings: {
              upsert: updatedMeanings,
              deleteMany: deleted.meanings.map(m => ({ id: m })),
            },
          },
          create: {
            ...createCategory(category),
          },
        };
      });

      return ctx.prisma.$transaction(async tx => {
        return await tx.word.update({
          where: { id: existingWord.id },
          data: {
            name: updatedWord.name,
            transcription: updatedWord.transcription,
            categories: {
              upsert: updatedCategories,
              deleteMany: deleted.categories.map(m => ({ id: m })),
            },
          },
        });
      });
    }),
});

function getDeletedItems<T extends { id: string; meanings: { id: string }[] }>(
  existingCategories: T[],
  updatedCategories: T[],
) {
  const deletedCategories = existingCategories.filter(
    category =>
      !updatedCategories.some(
        c => c.id === category.id || category.meanings.length === 0,
      ),
  );

  const currentMeanings = existingCategories.map(c => c.meanings).flat();
  const newMeanings = updatedCategories.map(c => c.meanings).flat();
  const deletedMeanings = currentMeanings.filter(
    currMean => !newMeanings.some(newMean => newMean.id === currMean.id),
  );

  return {
    categories: deletedCategories.map(c => c.id),
    meanings: deletedMeanings.map(m => m.id),
  };
}

function createWord(data: Word, userId?: string) {
  return {
    name: data.name,
    transcription: data.transcription,
    ...(userId && { createdById: userId }),
    categories: {
      create: data.categories.map(createCategory),
    },
  };
}

function createCategory(category: Category) {
  return {
    name: category.name,
    meanings: {
      create: category.meanings.map(createMeaning),
    },
  };
}

function createMeaning(meaning: Meaning) {
  return {
    definition: meaning.definition,
    example: meaning.example,
  };
}
