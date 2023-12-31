import { z } from "zod";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

import { getUniqueDictionaries } from "~/features/sort-words";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type Category,
  type Meaning,
  type Word,
  WordSchema,
} from "~/types/ApiTypes";

// Prior to using MongoDB, we could pass any nonsensical id, and it'd work,
// however, MongoDB wants exactly ObjectId-ish value
const NonExistentId = "000000000000000000000000";

const UpdateWordSchema = WordSchema.partial().required({
  id: true,
});

export const wordRouter = createTRPCRouter({
  getWordsToRevise: protectedProcedure
    .input(z.string().nullable())
    .query(({ input, ctx }) => {
      return ctx.prisma.word.findMany({
        where: {
          createdById: ctx.authedUser.id,
          interval: { lte: new Date() },
          ...(input && {
            dictionary: { contains: input, mode: "insensitive" },
          }),
        },
        include: { categories: { include: { meanings: true } } },
      });
    }),

  getDictionaries: protectedProcedure.query(async ({ ctx }) => {
    const dictionaries = await ctx.prisma.word.findMany({
      where: {
        dictionary: { not: null },
      },
      select: { dictionary: true },
      distinct: ["dictionary"],
    });

    return getUniqueDictionaries(dictionaries);
  }),

  getAll: protectedProcedure
    .input(z.string().nullable())
    .query(({ input, ctx }) => {
      return ctx.prisma.word.findMany({
        where: {
          createdById: ctx.authedUser.id,
          ...(input && {
            dictionary: { contains: input, mode: "insensitive" },
          }),
        },
        include: { categories: { include: { meanings: true } } },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ wordId: z.string() }))
    .query(async ({ ctx, input }) => {
      const word = await ctx.prisma.word.findUnique({
        where: { id: input.wordId },
        include: { categories: { include: { meanings: true } } },
      });

      if (!word) throw new TRPCError({ code: "NOT_FOUND" });

      if (word.createdById !== ctx.authedUser.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      return word;
    }),

  createWord: protectedProcedure
    .input(WordSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.word.create({
        data: createWord({ ...input, createdById: ctx.authedUser.id }),
      });
    }),

  updateWord: protectedProcedure
    .input(UpdateWordSchema)
    .mutation(async ({ ctx, input: partialUpdatedWord }) => {
      const existingWord = await ctx.prisma.word.findUnique({
        where: { id: partialUpdatedWord.id },
        include: { categories: { include: { meanings: true } } },
      });

      if (!existingWord) throw new TRPCError({ code: "NOT_FOUND" });
      const updatedWord = { ...existingWord, ...partialUpdatedWord };

      if (existingWord.createdById !== updatedWord.createdById)
        throw new TRPCError({ code: "FORBIDDEN" });

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
                  ? NonExistentId
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
                ? NonExistentId
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...updatedWordRest } = updatedWord;

        return await tx.word.update({
          where: { id: existingWord.id },
          data: {
            ...updatedWordRest,
            categories: {
              upsert: updatedCategories,
              deleteMany: deleted.categories.map(m => ({ id: m })),
            },
          },
        });
      });
    }),

  deleteWord: protectedProcedure
    .input(z.object({ id: z.string(), dictionary: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const existingWord = await ctx.prisma.word.findUnique({
        where: { id: input.id },
      });

      if (!existingWord) throw new TRPCError({ code: "NOT_FOUND" });

      if (existingWord.createdById !== ctx.authedUser.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      return ctx.prisma.word.delete({
        where: { id: input.id },
      });
    }),

  importWords: protectedProcedure
    .input(WordSchema.array())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async tx => {
        // Hacky way, since createMany doesn't return createdWords
        const createdWords = input.map(w =>
          tx.word.create({ data: createWord(w) }),
        );
        const awaitedWords = await Promise.all(createdWords);
        const awaitedIds = awaitedWords.map(w => ({ id: w.id }));

        return tx.user.update({
          where: { id: ctx.authedUser.id },
          data: {
            words: {
              connect: awaitedIds,
            },
          },
        });
      });
    }),

  undoImportWords: protectedProcedure
    .input(WordSchema.array())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async tx => {
        const existingWords = await ctx.prisma.word.findMany({
          where: { createdById: ctx.authedUser.id },
        });

        const words = input.map(w => ({
          where: { id: w.id },
          create: createWord(w),
        }));

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

  toggleShareCode: protectedProcedure
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
        data: { shareCode: existingWord.shareCode ? null : nanoid() },
      });
    }),

  importFromCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingWord = await ctx.prisma.word.findFirst({
        where: { shareCode: input.code },
        include: { categories: { include: { meanings: true } } },
      });

      if (!existingWord) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.prisma.$transaction(async tx => {
        await tx.word.update({
          where: { id: existingWord.id },
          data: { shareCode: null },
        });

        return tx.word.create({
          data: createWord({
            ...existingWord,
            shareCode: null,
            createdById: ctx.authedUser.id,
          }),
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

function createWord(data: Word) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, ...wordRest } = data;
  return {
    ...wordRest,
    categories: {
      create: data.categories.map(createCategory),
    },
    ...(createdAt && { createdAt }),
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
