import { nanoid } from "nanoid";
import { type Word } from "~/types/ApiTypes";

type ModifyingOptions = {
  appendWithId?: boolean;
  appendWithEmptyId?: boolean;
};

export default function modifyWordId(
  word: Word,
  options: ModifyingOptions = { appendWithId: false, appendWithEmptyId: false },
): Word {
  const { appendWithId, appendWithEmptyId } = options;

  let newWordId = "";
  if (appendWithId) newWordId = nanoid();

  const modifiedCategories = word.categories.map(oldCategory => {
    let newCategoryId = "";
    if (appendWithId) newCategoryId = nanoid();

    const modifiedMeanings = oldCategory.meanings.map(oldMeaning => {
      let newMeaningId = "";
      if (appendWithId) newMeaningId = nanoid();

      return {
        ...oldMeaning,
        id: appendWithEmptyId ? newMeaningId : newMeaningId || oldMeaning.id,
        categoryId: appendWithEmptyId
          ? newCategoryId
          : newCategoryId || oldCategory.id,
      };
    });

    return {
      ...oldCategory,
      id: appendWithEmptyId ? newCategoryId : newCategoryId || oldCategory.id,
      meanings: modifiedMeanings,
      wordId: appendWithEmptyId ? newWordId : newWordId || oldCategory.wordId,
    };
  });

  return {
    ...word,
    id: appendWithEmptyId ? newWordId : newWordId || word.id,
    categories: modifiedCategories,
    createdById: appendWithEmptyId ? newWordId : newWordId || word.createdById,
  };
}
