import { useEffect } from "react";

import parseDate from "~/utils/parseDate";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { api, type ReactQueryOptions, type RouterInputs } from "~/utils/api";

type WordGetAllInput = RouterInputs["words"]["getAll"];
type WordsGetAllOptions = ReactQueryOptions["words"]["getAll"];

export default function useWords(
  dictionary: WordGetAllInput,
  props?: Partial<WordsGetAllOptions>,
) {
  const isAuthed = useSessionData(state => state.isAuthed);
  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);
  const status = useSessionData(state => state.status);

  const authedWords = api.words.getAll.useQuery(dictionary, {
    ...props,
    enabled: isAuthed && (props?.enabled === undefined ? true : props.enabled),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) {
      const parsedWords = (JSON.parse(localData) as Word[])
        .map(parseDate)
        .filter(w =>
          dictionary && w.dictionary
            ? w.dictionary.toLowerCase() === dictionary.toLowerCase()
            : true,
        );

      setLocalWords(parsedWords);
    }
  }, [dictionary, setLocalWords]);

  return {
    ...authedWords,
    isLoading: status === "unauthenticated" ? false : authedWords.isLoading,
    data: status === "unauthenticated" ? localWords : authedWords.data || [],
  };
}
