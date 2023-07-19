import { nanoid } from "nanoid";
import { type Word } from "~/types/ApiTypes";

export default function wordWithId(word: Word, appendWithString = false): Word {
  const wordId = word.id || appendWithString ? "" : nanoid();

  const { categories, ...rest } = word;
  const moddedCategories = categories.map(category => {
    const moddedMeanings = category.meanings.map(meaning => ({
      ...meaning,
      id: meaning.id || appendWithString ? "" : nanoid(),
      categoryId: category.id || appendWithString ? "" : nanoid(),
    }));

    return { ...category, id: nanoid(), wordId, meanings: moddedMeanings };
  });

  return {
    ...rest,
    id: wordId,
    categories: moddedCategories,
    createdById: word.createdById || appendWithString ? "" : nanoid(),
  };
}
