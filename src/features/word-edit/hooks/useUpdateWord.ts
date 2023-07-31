import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useSessionData from "~/store/useSessionData";
import useLocalData from "~/store/useLocalData";

export default function useUpdateWord() {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: updateWordMutation } = api.words.updateWord.useMutation({
    onSuccess() {
      utils.words.getById.invalidate({ wordId: "" }).catch(console.error);
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
