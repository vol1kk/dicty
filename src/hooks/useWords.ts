import { useEffect } from "react";

import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";

export default function useWords() {
  const isAuthed = useSessionData(state => state.isAuthed);
  const localWords = useLocalData(state => state.words);
  const setLocalWords = useLocalData(state => state.setWords);
  const status = useSessionData(state => state.status);

  const authedWords = api.words.getAll.useQuery(undefined, {
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) setLocalWords(JSON.parse(localData) as Word[]);
  }, [setLocalWords]);

  return {
    isLoading: status === "unauthenticated" ? false : authedWords.isLoading,
    data: status === "unauthenticated" ? localWords : authedWords.data || [],
  };
}
