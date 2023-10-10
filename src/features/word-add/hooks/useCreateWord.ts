import { api, type RouterInputs } from "~/utils/api";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";
import {
  basicErrorCallback,
  basicMutateCallback,
} from "~/features/shared/utils";

type UseCreateWordInput = RouterInputs["words"]["createWord"];

export default function useCreateWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();

  const isAuthed = useSessionData(state => state.isAuthed);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate } = api.words.createWord.useMutation({
    async onMutate(word) {
      if (props?.onSuccess) props.onSuccess();

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

  return function createWord(word: UseCreateWordInput) {
    const modifiedWord = modifyWordId(word, { appendWithId: true });
    modifiedWord.createdAt = new Date();

    if (isAuthed) mutate(modifiedWord);

    if (!isAuthed) {
      setLocalWords(words => {
        const newState = [modifiedWord, ...words];
        localStorage.setItem("words", JSON.stringify(newState));

        return newState;
      });

      if (props?.onSuccess) props.onSuccess();
    }
  };
}
