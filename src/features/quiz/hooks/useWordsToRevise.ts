import { api } from "~/utils/api";
import useSessionData from "~/store/useSessionData";
import useLocalData from "~/store/useLocalData";
import { useMemo } from "react";

export default function useWordsToRevise() {
  const isAuthed = useSessionData(state => state.isAuthed);
  const localWords = useLocalData(state => state.words);
  const status = useSessionData(state => state.status);

  const authedWords = api.words.getWordsToRevise.useQuery(undefined, {
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  const wordsToRevise = useMemo(
    () => localWords.filter(w => new Date().getTime() >= w.interval.getTime()),
    [localWords],
  );

  return {
    ...authedWords,
    isLoading: status === "unauthenticated" ? false : authedWords.isLoading,
    data: status === "unauthenticated" ? wordsToRevise : authedWords.data || [],
  };
}
