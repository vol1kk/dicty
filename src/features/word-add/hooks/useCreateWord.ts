import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";

export default function useCreateWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate } = api.words.createWord.useMutation({
    async onMutate(word) {
      if (props?.onSuccess) props?.onSuccess();

      await utils.words.getAll.cancel();

      const previousData = utils.words.getAll.getData();
      const dictionary = word.dictionary ? word.dictionary : null;

      if (previousData) {
        const optimisticData = [word, ...previousData];
        utils.words.getAll.setData(dictionary, optimisticData);
      }

      return { previousData, dictionary };
    },

    onSettled() {
      utils.words.invalidate().catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);
      if (context)
        utils.words.getAll.setData(context.dictionary, context.previousData);
    },
  });

  function createWord(word: Word) {
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
  }

  return createWord;
}
