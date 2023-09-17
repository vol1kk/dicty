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

  if (!appendWithId && !appendWithEmptyId) return word;

  let newWordId = "";
  if (appendWithId) newWordId = word.id ? word.id : nanoid();

  let newCreatedById = "";
  if (appendWithId)
    newCreatedById = word.createdById ? word.createdById : nanoid();

  const modifiedCategories = word.categories.map(oldCategory => {
    let newCategoryId = "";
    if (appendWithId)
      newCategoryId = oldCategory.id ? oldCategory.id : nanoid();

    const modifiedMeanings = oldCategory.meanings.map(oldMeaning => {
      let newMeaningId = "";
      if (appendWithId) newMeaningId = oldMeaning.id ? oldMeaning.id : nanoid();

      return {
        ...oldMeaning,
        id: newMeaningId,
        categoryId: newCategoryId,
      };
    });

    return {
      ...oldCategory,
      id: newCategoryId,
      meanings: modifiedMeanings,
      wordId: newWordId,
    };
  });

  return {
    ...word,
    id: newWordId,
    categories: modifiedCategories,
    createdById: newCreatedById,
  };
}
