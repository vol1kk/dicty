import { getQueryKey } from "@trpc/react-query";

import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";

type WordCreatedAtFixed = Omit<Word, "createdAt"> & {
  createdAt: Date;
};

export default function useUpdateWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const queryKey = getQueryKey(api.words.getAll);
  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: updateWordMutation } = api.words.updateWord.useMutation({
    async onMutate(word) {
      await utils.words.getAll.cancel();

      const previousData = utils.words.getAll.getData();

      if (previousData) {
        const optimisticData = previousData.map(w =>
          w.id == word.id ? word : w,
        ) as WordCreatedAtFixed[];

        utils.words.getAll.setData(void queryKey, optimisticData);
      }

      return { previousData };
    },

    onSuccess(res) {
      if (props?.onSuccess) props.onSuccess();

      utils.words.getAll.invalidate().catch(console.error);
      utils.words.getById.invalidate({ wordId: res.id }).catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);

      if (context?.previousData)
        utils.words.getAll.setData(void queryKey, context.previousData);
    },
  });

  function updateWord(word: Word) {
    if (isAuthed) updateWordMutation(word);

    if (!isAuthed) {
      const updatedWords = localWords.map(prevWord =>
        prevWord.id === word.id ? word : prevWord,
      );

      setLocalWords(updatedWords);
      localStorage.setItem("words", JSON.stringify(updatedWords));

      if (props?.onSuccess) props.onSuccess();
    }
  }

  return updateWord;
}
