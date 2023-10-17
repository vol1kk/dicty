import { useMemo } from "react";

import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { api, type RouterInputs } from "~/utils/api";

type UseWordsToReviseProps = RouterInputs["words"]["getWordsToRevise"];

export default function useWordsToRevise(input: UseWordsToReviseProps) {
  const isAuthed = useSessionData(state => state.isAuthed);
  const localWords = useLocalData(state => state.words);
  const status = useSessionData(state => state.status);

  const authedWords = api.words.getWordsToRevise.useQuery(input, {
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
