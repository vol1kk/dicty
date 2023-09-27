import { getQueryKey } from "@trpc/react-query";

import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";
import modifyWordId from "~/utils/modifyWordId";

export default function useUpdateWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const queryKey = getQueryKey(api.words.getAll);
  const isAuthed = useSessionData(state => state.isAuthed);

  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: updateWordMutation } = api.words.updateWord.useMutation({
    async onMutate(word) {
      if (props?.onSuccess) props?.onSuccess();

      await utils.words.getAll.cancel();

      const previousData = utils.words.getAll.getData();

      if (previousData) {
        const optimisticData = previousData.map(w =>
          w.id == word.id ? word : w,
        );

        utils.words.getAll.setData(void queryKey, optimisticData);
      }

      return { previousData };
    },

    onSettled() {
      utils.words.getAll.invalidate().catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);

      if (context?.previousData)
        utils.words.getAll.setData(void queryKey, context.previousData);
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
