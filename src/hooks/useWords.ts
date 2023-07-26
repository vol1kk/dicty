import { useEffect, useState } from "react";
import { type Word } from "~/types/ApiTypes";
import { api } from "~/utils/api";
import useSessionData from "~/store/useSessionData";
import modifyWordId from "~/utils/modifyWordId";

type UseWordsReturnType = {
  data: Word[];
  createWord: (word: Word) => void;
  updateWord: (word: Word) => void;
  deleteWord: (id: string) => void;
  importWords: (words: Word[]) => void;
};

export default function useWords(): UseWordsReturnType {
  const utils = api.useContext();
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

  const [localWords, setLocalWords] = useState<Word[]>([]);
  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) setLocalWords(JSON.parse(localData) as Word[]);
  }, []);

  function createWord(word: Word) {
    if (isAuthed)
      createWordMutation(modifyWordId(word, { appendWithEmptyId: true }));

    if (!isAuthed) {
      const wordWithId = modifyWordId(word, { appendWithId: true });
      localStorage.setItem(
        "words",
        JSON.stringify([wordWithId, ...localWords]),
      );
      setLocalWords(p => [wordWithId, ...p]);
    }
  }

  function updateWord(word: Word) {
    if (isAuthed) updateWordMutation(word);

    if (!isAuthed) {
      setLocalWords(prevWords => {
        const updatedWords = prevWords.map(prevWord =>
          prevWord.id === word.id ? word : prevWord,
        );
        localStorage.setItem("words", JSON.stringify(updatedWords));
        return updatedWords;
      });
    }
  }

  function deleteWord(id: string) {
    if (isAuthed) deleteWordMutation({ id });
    if (!isAuthed) {
      setLocalWords(prevWords => {
        const filteredWords = prevWords.filter(w => w.id !== id);
        localStorage.setItem("words", JSON.stringify(filteredWords));
        return filteredWords;
      });
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
