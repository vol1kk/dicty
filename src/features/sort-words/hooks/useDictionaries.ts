import { useEffect, useState } from "react";

import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import useSessionData from "~/store/useSessionData";

export default function useDictionaries() {
  const isAuthed = useSessionData(state => state.isAuthed);
  const [localDictionaries, setLocalDictionaries] = useState<string[]>([]);
  const status = useSessionData(state => state.status);

  const authedDictionaries = api.words.getDictionaries.useQuery(undefined, {
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const localData = localStorage.getItem("words");
    if (localData) {
      const parsedWords = (JSON.parse(localData) as Word[])
        .filter(w => w.dictionary)
        .map(w => w.dictionary) as string[];

      setLocalDictionaries(parsedWords);
    }
  }, []);

  return {
    ...authedDictionaries,
    isLoading:
      status === "unauthenticated" ? false : authedDictionaries.isLoading,
    data:
      status === "unauthenticated"
        ? localDictionaries
        : authedDictionaries.data || [],
  };
}
