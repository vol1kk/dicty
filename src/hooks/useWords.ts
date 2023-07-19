import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { type Word } from "~/types/ApiTypes";
import { api } from "~/utils/api";

type UseWordsLocalResult = {
  data: Word[];
  setWords: Dispatch<SetStateAction<Word[]>>;
  fromApi: false;
};

type UseWordsApiResult = {
  data: Word[];
  deleteWord: ReturnType<typeof api.words.deleteWord.useMutation>["mutate"];
  createWord: ReturnType<typeof api.words.createWord.useMutation>["mutate"];
  updateWord: ReturnType<typeof api.words.updateWord.useMutation>["mutate"];
  fromApi: true;
};

type UseWordsDefaultReturn = { data: undefined };

export default function useWords():
  | UseWordsDefaultReturn
  | UseWordsLocalResult
  | UseWordsApiResult {
  const utils = api.useContext();
  const { data: sessionData } = useSession();
  const [isAuthed, setIsAuthed] = useState(false);
  const authedWords = api.words.getWords.useQuery(undefined, {
    enabled: isAuthed,
  });

  const { mutate: deleteWord } = api.words.deleteWord.useMutation();
  const { mutate: createWord } = api.words.createWord.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.log);
    },
  });
  const { mutate: updateWord } = api.words.updateWord.useMutation();

  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const localWords = localStorage.getItem("words");
    if (localWords) setWords(JSON.parse(localWords) as Word[]);
  }, []);

  useEffect(() => {
    if (sessionData?.user) setIsAuthed(true);
    else setIsAuthed(false);
  }, [sessionData]);

  if (authedWords.data) {
    return {
      createWord,
      deleteWord,
      updateWord,
      fromApi: true,
      data: authedWords.data as Word[],
    };
  }

  if (!sessionData?.user)
    return {
      setWords,
      data: words,
      fromApi: false,
    };

  return { data: undefined };
}
