import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const MeaningSchema = z.object({
  id: z.string(),
  definition: z.string(),
  example: z.string().nullable(),
});

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  meanings: z.array(MeaningSchema),
  wordId: z.string().nullable(),
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

      if (deleted.categories.length > 0)
        await ctx.prisma.category.deleteMany({
          where: { id: { in: deleted.categories } },
        });

      if (deleted.meanings.length > 0)
        await ctx.prisma.meaning.deleteMany({
          where: { id: { in: deleted.meanings } },
        });

      const updatedCategories = updatedWord.categories.map(async category => {
        const existingCategory = existingWord.categories.find(
          c => c.id === category.id,
        );

        if (existingCategory) {
          const updatedMeanings = category.meanings.map(meaning => {
            const existingMeaning = existingCategory.meanings.find(
              m => m.id === meaning.id,
            );

            if (existingMeaning) {
              return ctx.prisma.meaning.update({
                where: { id: existingMeaning.id },
                data: meaning,
              });
            }

            if (!existingMeaning) {
              return ctx.prisma.meaning.create({
                data: {
                  ...meaning,
                  category: { connect: { id: existingCategory.id } },
                },
              });
            }
          });

          await Promise.all(updatedMeanings);
        }

        if (!existingCategory) {
          return ctx.prisma.category.create({
            data: {
              name: category.name,
              meanings: {
                create: category.meanings,
              },
              word: { connect: { id: existingWord.id } },
            },
          });
        }
      });

      await Promise.all(updatedCategories);

      await ctx.prisma.word.update({
        where: { id: existingWord.id },
        data: {
          name: updatedWord.name,
          transcription: updatedWord.transcription,
        },
      });

      return ctx.prisma.word.findUnique({ where: { id: existingWord.id } });
    }),
});

function getDeletedItems<T extends { id: string; meanings: { id: string }[] }>(
  existingCategories: T[],
  updatedCategories: T[],
) {
  const deletedCategories = existingCategories.filter(category =>
    updatedCategories.some(
      c => c.id !== category.id || c.meanings.length === 0,
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
      create: category.meanings.map(meaning => ({
        definition: meaning.definition,
        example: meaning.example,
      })),
    },
  };
}
