import { getUniqueDictionaries } from "~/features/sort-words";
import { type api, type RouterInputs } from "~/utils/api";
import basicPreviousData from "~/features/shared/utils/basicPreviousData";

type BasicMutateCallback = {
  utils: ReturnType<typeof api.useContext>;
  word: RouterInputs["words"]["createWord" | "updateWord"];
};

export default async function basicMutateCallback({
  utils,
  word,
}: BasicMutateCallback) {
  await utils.words.getAll.cancel(null);
  await utils.words.getDictionaries.cancel();

  const { previousDictionaries, previousData, queryKey } =
    await basicPreviousData(utils, word);

  if (previousData) {
    const optimisticData = previousData.map(w => (w.id == word.id ? word : w));
    const optimisticDictionaries = getUniqueDictionaries(optimisticData);

    utils.words.getAll.setData(queryKey, optimisticData);
    utils.words.getDictionaries.setData(undefined, optimisticDictionaries);
  }

  return { previousData, previousDictionaries, queryKey };
}
