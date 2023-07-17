import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { type Word } from "~/utils/placeholder";

export default function useWords() {
  // const { data: sessionData } = useSession();
  // const words = api
  // const { mutate: addWordMutation } = api
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const localWords = localStorage.getItem("words");
    if (localWords) setWords(JSON.parse(localWords) as Word[]);
  }, []);

  // if (sessionData) {
  //   return [words.data, addWordMutation];
  // }

  return [words, setWords] as const;
}
