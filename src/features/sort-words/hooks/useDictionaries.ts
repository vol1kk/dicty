import { useEffect, useState } from "react";

import { type Word } from "~/types/ApiTypes";
import useSessionData from "~/store/useSessionData";
import { api, type ReactQueryOptions } from "~/utils/api";

type UseDictionariesOptions = ReactQueryOptions["words"]["getDictionaries"];

export default function useDictionaries(
  props?: Partial<UseDictionariesOptions>,
) {
  const isAuthed = useSessionData(state => state.isAuthed);
  const [localDictionaries, setLocalDictionaries] = useState<string[]>([]);
  const status = useSessionData(state => state.status);

  const authedDictionaries = api.words.getDictionaries.useQuery(undefined, {
    enabled: isAuthed,
    refetchOnWindowFocus: false,
    ...props,
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
