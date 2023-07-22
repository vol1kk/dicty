import { nanoid } from "nanoid";
import { type Word } from "~/types/ApiTypes";

type ModifyingOptions = {
  appendWithId?: boolean;
  appendWithEmptyId?: boolean;
};

export default function modifyWordId(
  word: Word,
  options: ModifyingOptions = { appendWithEmptyId: true },
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
        id: appendWithEmptyId ? newMeaningId : newMeaningId ?? oldMeaning.id,
        definition: oldMeaning.definition,
        example: oldMeaning.example,
        categoryId: appendWithEmptyId
          ? newCategoryId
          : newCategoryId ?? oldCategory.id,
      };
    });

    return {
      id: appendWithEmptyId ? newCategoryId : newCategoryId ?? oldCategory.id,
      name: oldCategory.name,
      meanings: modifiedMeanings,
      wordId: appendWithEmptyId ? newWordId : newWordId ?? oldCategory.wordId,
    };
  });

  return {
    id: appendWithEmptyId ? newWordId : newWordId ?? word.id,
    name: word.name,
    transcription: word.transcription,
    categories: modifiedCategories,
    createdById: appendWithEmptyId ? newWordId : newWordId ?? word.createdById,
  };
}
