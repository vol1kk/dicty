import Head from "next/head";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useMemo, useState } from "react";

import Spinner from "~/components/Spinner";
import NotFound from "~/components/NotFound";
import { type Word as IWord } from "~/types/ApiTypes";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import { SuperMemo, useWordsToRevise } from "~/features/quiz";
import QuizWord from "~/features/quiz/components/QuizWord";
import QuizOptions from "~/features/quiz/components/QuizOptions";

export default function QuizPage() {
  const { data: words, isLoading } = useWordsToRevise();

  // probably in quiz/start
  const [isClicked, setIsClicked] = useState(false);

  // probably in quiz/ and show loading spinner inside a button
  const [isCompletelyLoaded, setIsCompletelyLoaded] = useState(false);

  // probably in quiz/start
  const [revisedWordsIds, setRevisedWordsIds] = useState<string[]>([]);
  const unrevisedWords = useMemo(
    () => words.filter(w => !revisedWordsIds.includes(w.id)),
    [words, revisedWordsIds],
  );

  const [selectedWord, setSelectedWord] = useState<IWord | null | undefined>(
    null,
  );

  useEffect(() => {
    if (!isLoading) {
      const initialSelectedWord =
        SuperMemo.retrieveShortestInterval(unrevisedWords);

      setSelectedWord(initialSelectedWord);
      if (initialSelectedWord || initialSelectedWord === undefined)
        setIsCompletelyLoaded(true);
    }
  }, [unrevisedWords, isLoading]);

  if (!isCompletelyLoaded)
    return (
      <main className="grid place-content-center">
        <Spinner text={"Loading"} dimensions={64} />
      </main>
    );

  if (words?.length === 0)
    return (
      <main className="grid place-content-center">
        <NotFound dimensions={64} text="No words to revise!" />
      </main>
    );

  if (!selectedWord)
    return (
      <main className="grid place-content-center">
        <NotFound dimensions={64} text="Couldn't find the word!" />
      </main>
    );

  return (
    <>
      <Head>
        <title>Dicty | Quiz</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <QuizWord word={selectedWord} isClicked={isClicked} />
        <QuizOptions
          isClicked={isClicked}
          selectedWord={selectedWord}
          setIsClicked={setIsClicked}
          revisedWordsIds={revisedWordsIds}
          setRevisedWordsIds={setRevisedWordsIds}
          isLastWord={unrevisedWords.length === 1}
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? "en",
      ["common"],
      nextI18nConfig,
    )),
  },
});
