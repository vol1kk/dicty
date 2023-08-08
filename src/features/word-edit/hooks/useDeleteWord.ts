import { api } from "~/utils/api";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";

export default function useDeleteWord({ onError, onSuccess }: HookOptions) {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: deleteWordMutation } = api.words.deleteWord.useMutation({
    onSuccess() {
      utils.words.getAll.invalidate().then(onSuccess).catch(console.error);
    },

    onError(e) {
      onError(e.message);
    },
  });

  function deleteWord(id: string) {
    if (isAuthed) deleteWordMutation({ id });

    if (!isAuthed) {
      const filteredWords = localWords.filter(w => w.id !== id);
      localStorage.setItem("words", JSON.stringify(filteredWords));

      setLocalWords(filteredWords);
    }
  }

  return deleteWord;
}
