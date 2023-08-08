import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useSessionData from "~/store/useSessionData";
import useLocalData from "~/store/useLocalData";

export default function useImportWords() {
  const utils = api.useContext();
  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);
  const isAuthed = useSessionData(state => state.isAuthed);

  const { mutate: importWordsMutation } = api.words.importWords.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.log);
    },
  });

  function importWords(words: Word[]) {
    if (isAuthed) {
      const wordsWithEmptyIds = words.map(w =>
        modifyWordId(w, { appendWithEmptyId: true }),
      );
      importWordsMutation(wordsWithEmptyIds);
    }

    if (!isAuthed) {
      const wordsWithId = words.map(w =>
        modifyWordId(w, { appendWithId: true }),
      );
      setLocalWords([...localWords, ...wordsWithId]);
      localStorage.setItem("words", JSON.stringify(wordsWithId));
    }
  }

  return importWords;
}
