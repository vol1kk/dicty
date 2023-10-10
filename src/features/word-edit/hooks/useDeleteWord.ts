import { api, type RouterInputs } from "~/utils/api";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";
import { getUniqueDictionaries } from "~/features/sort-words";

export type UseDeleteWordInputs = RouterInputs["words"]["deleteWord"];

export default function useDeleteWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();

  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: deleteWordMutation } = api.words.deleteWord.useMutation({
    async onMutate(word) {
      if (props?.onSuccess) props?.onSuccess();

      await utils.words.getAll.cancel(null);
      await utils.words.getDictionaries.cancel();

      let queryKey = null;
      let previousData = utils.words.getAll.getData(queryKey);

      if (!previousData) {
        queryKey = word.dictionary;
        previousData = utils.words.getAll.getData(queryKey);

        await utils.words.getAll.cancel(queryKey);
      }

      if (previousData) {
        const optimisticData = previousData.filter(w => w.id !== word.id);
        const optimisticDictionaries = getUniqueDictionaries(optimisticData);

        utils.words.getAll.setData(queryKey, optimisticData);
        utils.words.getDictionaries.setData(undefined, optimisticDictionaries);
      }

      const previousDictionaries = utils.words.getDictionaries.getData();
      return { previousData, previousDictionaries, queryKey };
    },

    onSettled() {
      utils.words.invalidate().catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);

      if (context) {
        utils.words.getAll.setData(context.queryKey, context.previousData);
        utils.words.getDictionaries.setData(
          undefined,
          context.previousDictionaries,
        );
      }
    },
  });

  return function deleteWord(word: UseDeleteWordInputs) {
    if (isAuthed) deleteWordMutation(word);

    if (!isAuthed) {
      const filteredWords = localWords.filter(w => w.id !== word.id);

      localStorage.setItem("words", JSON.stringify(filteredWords));
      setLocalWords(filteredWords);

      if (props?.onSuccess) props.onSuccess();
    }
  };
}
