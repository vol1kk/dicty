import { getQueryKey } from "@trpc/react-query";

import { api } from "~/utils/api";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";

export default function useDeleteWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const queryKey = getQueryKey(api.words.getAll);
  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: deleteWordMutation } = api.words.deleteWord.useMutation({
    async onMutate(word) {
      await utils.words.getAll.cancel();

      const previousData = utils.words.getAll.getData();

      if (previousData) {
        const optimisticData = previousData.filter(w => w.id !== word.id);
        utils.words.getAll.setData(void queryKey, optimisticData);
      }

      return { previousData };
    },

    onSuccess: props?.onSuccess,

    onSettled() {
      utils.words.getAll.invalidate().catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);

      if (context?.previousData)
        utils.words.getAll.setData(void queryKey, context.previousData);
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
