import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type Word } from "~/utils/placeholder";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

type UseWordsResultWithData = {
  data: Word[];
  setWords: Dispatch<SetStateAction<Word[]>>;
  fromApi: false;
};

type UseWordsResultFromApi = {
  data: Word[];
  deleteWord: ReturnType<typeof api.words.deleteWord.useMutation>["mutate"];
  createWord: ReturnType<typeof api.words.createWord.useMutation>["mutate"];
  fromApi: true;
};

export default function useWords():
  | UseWordsResultWithData
  | UseWordsResultFromApi
  | { data: undefined } {
  const { data: sessionData } = useSession();
  const authedWords = api.words.getWords.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { mutate: deleteWord } = api.words.deleteWord.useMutation();
  const { mutate: createWord } = api.words.createWord.useMutation();

  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const localWords = localStorage.getItem("words");
    if (localWords) setWords(JSON.parse(localWords) as Word[]);
  }, []);

  if (authedWords.data) {
    return {
      deleteWord,
      createWord,
      fromApi: true,
      data: authedWords.data as Word[],
    } as const;
  }

  if (!authedWords.isFetching && !sessionData?.user)
    return {
      setWords,
      data: words,
      fromApi: false,
    } as const;

  return { data: undefined };
}
