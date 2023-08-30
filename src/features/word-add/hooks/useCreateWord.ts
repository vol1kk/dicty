import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";

type UseCreateWordProps = {
  onSuccess?(): void;
  onError?(e: string): void;
};

export default function useCreateWord(props?: UseCreateWordProps) {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate } = api.words.createWord.useMutation({
    onSuccess() {
      if (props?.onSuccess) props.onSuccess();

      utils.words.invalidate().catch(console.error);
    },

    onError(e) {
      if (props?.onError) props.onError(e.message);
    },
  });

  function createWord(word: Word) {
    if (isAuthed) mutate(modifyWordId(word, { appendWithEmptyId: true }));

    if (!isAuthed) {
      const wordWithId = {
        ...modifyWordId(word, { appendWithId: true }),
        createdAt: new Date(),
      };

      const _localWords = localStorage.getItem("words");
      const _parsedLocalWords = _localWords
        ? (JSON.parse(_localWords) as Word[])
        : [];

      localStorage.setItem(
        "words",
        JSON.stringify([wordWithId, ..._parsedLocalWords]),
      );
      setLocalWords([wordWithId, ..._parsedLocalWords]);

      if (props?.onSuccess) props.onSuccess();
    }
  }

  return createWord;
}
