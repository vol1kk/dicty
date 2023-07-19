import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const MeaningSchema = z.object({
  id: z.string(),
  definition: z.string(),
  example: z.string().nullable(),
});

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  meanings: z.array(MeaningSchema),
});

const WordSchema = z.object({
  id: z.string(),
  name: z.string(),
  transcription: z.string(),
  createdById: z.string().optional(),
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

function createWord(data: z.infer<typeof WordSchema>, userId: string) {
  return {
    name: data.name,
    createdById: userId,
    transcription: data.transcription,
    categories: {
      create: data.categories.map(createCategory),
    },
  };
}

function createCategory(category: z.infer<typeof CategorySchema>) {
  return {
    name: category.name,
    meanings: {
      create: category.meanings.map(createMeaning),
    },
  };
}

function createMeaning(meaning: z.infer<typeof MeaningSchema>) {
  return {
    definition: meaning.definition,
    example: meaning.example,
  };
}
