import { useEffect } from "react";

import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import parseLocalWord from "~/utils/parseLocalWords";

type UseWordProps = {
  enabled?: boolean;
};

export default function useWords(props?: Partial<UseWordProps>) {
  const isAuthed = useSessionData(state => state.isAuthed);
  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);
  const status = useSessionData(state => state.status);

  const authedWords = api.words.getAll.useQuery(undefined, {
    enabled: isAuthed && (props?.enabled === undefined ? true : props.enabled),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) {
      const parsedWords = (JSON.parse(localData) as Word[]).map(parseLocalWord);

      setLocalWords(parsedWords);
    }
  }, [setLocalWords]);

  return {
    ...authedWords,
    isLoading: status === "unauthenticated" ? false : authedWords.isLoading,
    data: status === "unauthenticated" ? localWords : authedWords.data || [],
  };
}
