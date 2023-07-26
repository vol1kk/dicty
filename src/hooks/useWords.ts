import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type Word } from "~/types/ApiTypes";
import { api } from "~/utils/api";
import useSessionData from "~/store/useSessionData";

type UseWordsLocalResult = {
  data: Word[];
  fromApi: false;
  setWords: Dispatch<SetStateAction<Word[]>>;
};

type UseWordsApiResult = {
  data: Word[];
  fromApi: true;
  deleteWord: ReturnType<typeof api.words.deleteWord.useMutation>["mutate"];
  updateWord: ReturnType<typeof api.words.updateWord.useMutation>["mutate"];
  createWord: ReturnType<typeof api.words.createWord.useMutation>["mutate"];
  importWords: ReturnType<typeof api.words.importWords.useMutation>["mutate"];
};

type UseWordsDefaultReturn = { data: undefined };

type UseWordsReturnType =
  | UseWordsDefaultReturn
  | UseWordsLocalResult
  | UseWordsApiResult;

export default function useWords(): UseWordsReturnType {
  const utils = api.useContext();
  const isAuthed = useSessionData(state => state.isAuthed);

  const authedWords = api.words.getWords.useQuery(undefined, {
    enabled: isAuthed,
  });
  const { mutate: deleteWord } = api.words.deleteWord.useMutation();
  const { mutate: updateWord } = api.words.updateWord.useMutation();
  const { mutate: createWord } = api.words.createWord.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.log);
    },
  });
  const { mutate: importWords } = api.words.importWords.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.log);
    },
  });

  const [localWords, setLocalWords] = useState<Word[]>([]);
  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) setLocalWords(JSON.parse(localData) as Word[]);
  }, []);

  if (authedWords.data) {
    return {
      createWord,
      deleteWord,
      updateWord,
      importWords,
      fromApi: true,
      data: authedWords.data as Word[],
    };
  }

  if (!isAuthed)
    return {
      fromApi: false,
      data: localWords,
      setWords: setLocalWords,
    };

  return { data: undefined };
}
