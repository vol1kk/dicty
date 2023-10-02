import { useEffect } from "react";

import { api } from "~/utils/api";
import parseDate from "~/utils/parseDate";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";

type UseWordProps = {
  enabled?: boolean;
};

export default function useWords(
  dictionary: string | null,
  props?: Partial<UseWordProps>,
) {
  const isAuthed = useSessionData(state => state.isAuthed);
  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);
  const status = useSessionData(state => state.status);

  const authedWords = api.words.getAll.useQuery(dictionary, {
    enabled: isAuthed && (props?.enabled === undefined ? true : props.enabled),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) {
      const parsedWords = (JSON.parse(localData) as Word[])
        .map(parseDate)
        .filter(w => (dictionary ? w.dictionary === dictionary : true));

      setLocalWords(parsedWords);
    }
  }, [dictionary, setLocalWords]);

  return {
    ...authedWords,
    isLoading: status === "unauthenticated" ? false : authedWords.isLoading,
    data: status === "unauthenticated" ? localWords : authedWords.data || [],
  };
}
