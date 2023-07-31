import { api } from "~/utils/api";
import useSessionData from "~/store/useSessionData";
import useLocalData from "~/store/useLocalData";

export default function useDeleteWord() {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: deleteWordMutation } = api.words.deleteWord.useMutation({
    onSuccess() {
      utils.words.getById.invalidate({ wordId: "" }).catch(console.error);
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
