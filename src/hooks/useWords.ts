import { useEffect } from "react";
import { type Word } from "~/types/ApiTypes";
import { api } from "~/utils/api";
import useSessionData from "~/store/useSessionData";
import modifyWordId from "~/utils/modifyWordId";
import useUserPreferences from "~/store/useUserPreferences";

type UseWordsReturnType = {
  data: Word[];
  createWord: (word: Word) => void;
  updateWord: (word: Word) => void;
  deleteWord: (id: string) => void;
  importWords: (words: Word[]) => void;
};

export default function useWords(): UseWordsReturnType {
  const utils = api.useContext();
  const localWords = useUserPreferences(state => state.words);
  const setLocalWords = useUserPreferences(state => state.setWords);
  const isAuthed = useSessionData(state => state.isAuthed);

  const authedWords = api.words.getWords.useQuery(undefined, {
    enabled: isAuthed,
  });
  const { mutate: deleteWordMutation } = api.words.deleteWord.useMutation();
  const { mutate: updateWordMutation } = api.words.updateWord.useMutation();
  const { mutate: createWordMutation } = api.words.createWord.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.log);
    },
  });
  const { mutate: importWordsMutation } = api.words.importWords.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.log);
    },
  });

  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) setLocalWords(JSON.parse(localData) as Word[]);
  }, [setLocalWords]);

  function createWord(word: Word) {
    if (isAuthed)
      createWordMutation(modifyWordId(word, { appendWithEmptyId: true }));

    if (!isAuthed) {
      const wordWithId = modifyWordId(word, { appendWithId: true });
      localStorage.setItem(
        "words",
        JSON.stringify([wordWithId, ...localWords]),
      );
      setLocalWords([wordWithId, ...localWords]);
    }
  }

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

  function deleteWord(id: string) {
    if (isAuthed) deleteWordMutation({ id });
    if (!isAuthed) {
      const filteredWords = localWords.filter(w => w.id !== id);
      localStorage.setItem("words", JSON.stringify(filteredWords));

      setLocalWords(filteredWords);
    }
  }

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
      setLocalWords(wordsWithId);
      localStorage.setItem("words", JSON.stringify(wordsWithId));
    }
  }

  return {
    data: isAuthed ? authedWords.data || [] : localWords,
    createWord,
    updateWord,
    deleteWord,
    importWords,
  };
}
