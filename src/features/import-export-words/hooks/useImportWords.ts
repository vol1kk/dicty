import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";

export default function useImportWords({ onError, onSuccess }: HookOptions) {
  const utils = api.useContext();
  const localWords = useLocalData(state => state.words);
  const isAuthed = useSessionData(state => state.isAuthed);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: importWordsMutation } = api.words.importWords.useMutation({
    onSuccess() {
      utils.words.invalidate().then(onSuccess).catch(console.log);
    },

    onError(e) {
      onError(e.message);
    },
  });

  const { mutate: undoImportWordsMutation } =
    api.words.undoImportWords.useMutation({
      onSuccess() {
        utils.words.invalidate().catch(console.log);
      },

      onError(e) {
        onError(e.message);
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
      localStorage.setItem(
        "words",
        JSON.stringify([...localWords, ...wordsWithId]),
      );
    }
  }

  function undoImport(words: Word[]) {
    if (isAuthed) {
      const wordsWithEmptyIds = words.map(w =>
        modifyWordId(w, { appendWithEmptyId: true }),
      );

      undoImportWordsMutation(wordsWithEmptyIds);
    }

    if (!isAuthed) {
      const wordsWithId = words.map(w =>
        modifyWordId(w, { appendWithId: true }),
      );

      setLocalWords(wordsWithId);
      localStorage.setItem("words", JSON.stringify(wordsWithId));
    }
  }

  return { importWords, undoImport };
}
