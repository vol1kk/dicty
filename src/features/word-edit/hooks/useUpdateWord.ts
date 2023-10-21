import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { api, type RouterInputs } from "~/utils/api";
import { type HookOptions } from "~/types/HookOptions";
import { getModifiedWords } from "~/features/word-edit";
import {
  basicErrorCallback,
  basicMutateCallback,
} from "~/features/shared/utils";

type UseEditWordInput = RouterInputs["words"]["updateWord"];

export default function useUpdateWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();

  const isAuthed = useSessionData(state => state.isAuthed);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: updateWordMutation } = api.words.updateWord.useMutation({
    async onMutate(word) {
      if (props?.onSuccess) props?.onSuccess();

      return await basicMutateCallback({ utils, word });
    },

    onSettled() {
      utils.words.invalidate().catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);

      if (context) basicErrorCallback({ utils, context });
    },
  });

  return function updateWord(word: UseEditWordInput) {
    if (isAuthed) updateWordMutation(word);

    if (!isAuthed) {
      setLocalWords(words => {
        const updatedWords = getModifiedWords(words, word);

        localStorage.setItem("words", JSON.stringify(updatedWords));

        return updatedWords;
      });

      if (props?.onSuccess) props.onSuccess();
    }
  };
}
