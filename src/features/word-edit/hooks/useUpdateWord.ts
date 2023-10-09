import { getQueryKey } from "@trpc/react-query";

import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";
import modifyWordId from "~/utils/modifyWordId";
import { getUniqueDictionaries } from "~/features/sort-words";

export default function useUpdateWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const getDictionariesKey = getQueryKey(api.words.getDictionaries);

  const isAuthed = useSessionData(state => state.isAuthed);

  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: updateWordMutation } = api.words.updateWord.useMutation({
    async onMutate(word) {
      if (props?.onSuccess) props?.onSuccess();

      await utils.words.getAll.cancel();

      const previousData = utils.words.getAll.getData();
      const previousDictionaries = utils.words.getDictionaries.getData();

      const dictionary = word.dictionary || null;
      if (previousData) {
        const optimisticData = previousData.map(w =>
          w.id == word.id ? word : w,
        );
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
      utils.words.invalidate().catch(console.error);
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

  function updateWord(word: Word) {
    const modifiedWord = modifyWordId(word, { appendWithId: true });

    if (isAuthed) updateWordMutation(modifiedWord);

    if (!isAuthed) {
      setLocalWords(words => {
        const updatedWords = words.map(prevWord =>
          prevWord.id === modifiedWord.id ? modifiedWord : prevWord,
        );

        localStorage.setItem("words", JSON.stringify(updatedWords));

        return updatedWords;
      });

      if (props?.onSuccess) props.onSuccess();
    }
  }

  return updateWord;
}
