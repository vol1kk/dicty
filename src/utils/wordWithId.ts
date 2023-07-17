import { nanoid } from "nanoid";
import { type Word } from "~/types/ApiTypes";

export default function wordWithId(word: Word): Word {
  const wordId = word.id || nanoid();

  const { categories, ...rest } = word;
  const moddedCategories = categories.map(category => {
    const moddedMeanings = category.meanings.map(meaning => ({
      ...meaning,
      id: meaning.id || nanoid(),
      categoryId: category.id || nanoid(),
    }));

    return { ...category, id: nanoid(), wordId, meanings: moddedMeanings };
  });

  return {
    ...rest,
    id: wordId,
    categories: moddedCategories,
    createdById: word.createdById || nanoid(),
  };
}
