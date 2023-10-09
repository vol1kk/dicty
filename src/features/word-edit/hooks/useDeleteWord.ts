import { getQueryKey } from "@trpc/react-query";

import { api } from "~/utils/api";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";
import { getUniqueDictionaries } from "~/features/sort-words";

export default function useDeleteWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const getDictionariesKey = getQueryKey(api.words.getDictionaries);

  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: deleteWordMutation } = api.words.deleteWord.useMutation({
    async onMutate(word) {
      if (props?.onSuccess) props?.onSuccess();

      await utils.words.getAll.cancel();

      const previousData = utils.words.getAll.getData();
      const previousDictionaries = utils.words.getDictionaries.getData();

      const deletedWord = previousData?.find(w => w.id === word.id);

      const dictionary = deletedWord?.dictionary || null;
      if (previousData) {
        const optimisticData = previousData.filter(w => w.id !== word.id);
        const optimisticDictionaries = getUniqueDictionaries(optimisticData);

        utils.words.getAll.setData(dictionary, optimisticData);
        utils.words.getDictionaries.setData(
          void getDictionariesKey,
          optimisticDictionaries,
        );
      }

      return { previousData, previousDictionaries, dictionary };
    },

    onSettled() {
      utils.words.getAll.invalidate().catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);

      if (context) {
        utils.words.getAll.setData(context.dictionary, context.previousData);
        utils.words.getDictionaries.setData(
          void getDictionariesKey,
          context.previousDictionaries,
        );
      }
    },
  });

  function deleteWord(id: string) {
    if (isAuthed) deleteWordMutation({ id });

    if (!isAuthed) {
      const filteredWords = localWords.filter(w => w.id !== id);

      localStorage.setItem("words", JSON.stringify(filteredWords));
      setLocalWords(filteredWords);

      if (props?.onSuccess) props.onSuccess();
    }
  }

  return deleteWord;
}
