import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useSessionData from "~/store/useSessionData";
import useLocalData from "~/store/useLocalData";

export default function useCreateWord() {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate } = api.words.createWord.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.error);
    },
  });

  function createWord(word: Word) {
    if (isAuthed) mutate(modifyWordId(word, { appendWithEmptyId: true }));

    if (!isAuthed) {
      const wordWithId = {
        ...modifyWordId(word, { appendWithId: true }),
        createdAt: new Date(),
      };

      localStorage.setItem(
        "words",
        JSON.stringify([wordWithId, ...localWords]),
      );
      setLocalWords([wordWithId, ...localWords]);
    }
  }

  return createWord;
}
