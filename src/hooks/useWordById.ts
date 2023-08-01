import { api } from "~/utils/api";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";

export default function useWordById(wordId: string) {
  const isAuthed = useSessionData(state => state.isAuthed);
  const status = useSessionData(state => state.status);

  const localWords = useLocalData(state => state.words);
  const localWord = localWords.find(w => w.id === wordId);

  const authedWord = api.words.getById.useQuery(
    { wordId },
    {
      enabled: isAuthed,
      refetchOnWindowFocus: false,
    },
  );

  return {
    isLoading: status === "unauthenticated" ? false : authedWord.isLoading,
    data: status === "unauthenticated" ? localWord : authedWord.data,
  };
}
