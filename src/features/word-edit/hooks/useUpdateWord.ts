import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";

export default function useUpdateWord(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: updateWordMutation } = api.words.updateWord.useMutation({
    async onSuccess(res) {
      utils.words.getAll
        .invalidate()
        .then(() => props?.onSuccess && props.onSuccess())
        .catch(console.error);
      await utils.words.getById
        .invalidate({ wordId: res.id })
        .then(() => console.log("invalidated by id"));
    },

    onError(e) {
      if (props?.onError) props.onError(e.message);
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
    }
  }

  return updateWord;
}
