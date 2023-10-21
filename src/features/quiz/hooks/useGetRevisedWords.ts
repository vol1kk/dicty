import { type Dispatch, type SetStateAction, useEffect } from "react";

import useRevisedWords, {
  type RevisedWord,
} from "~/features/quiz/store/useRevisedWords";

export default function useGetRevisedWords(
  setRevisionInd: Dispatch<SetStateAction<number>>,
) {
  const revisedWords = useRevisedWords(state => state.revisedWords);
  const setRevisedWords = useRevisedWords(state => state.setRevisedWords);

  useEffect(() => {
    const localData = localStorage.getItem("revisedWords");

    if (localData) {
      const parsedData = JSON.parse(localData) as Record<string, RevisedWord[]>;
      const parsedDates = Object.keys(parsedData);

      const today = new Date().toLocaleDateString("en-us");
      const revisedWordsTodayInd = parsedDates.findIndex(d => d === today);

      setRevisionInd(
        revisedWordsTodayInd !== -1
          ? revisedWordsTodayInd
          : parsedDates.length - 1,
      );
      setRevisedWords(parsedData);
    }
  }, [setRevisedWords, setRevisionInd]);

  return revisedWords;
}
