import Head from "next/head";
import React, { useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";

import NotFound from "~/components/NotFound";
import { type Word } from "~/types/ApiTypes";
import { SuperMemo } from "~/features/quiz";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import QuizWord from "~/features/quiz/components/QuizWord";
import QuizOptions from "~/features/quiz/components/QuizOptions";

export default function QuizStart({
  words,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isClicked, setIsClicked] = useState(false);
  const [revisedIds, setRevisedIds] = useState<string[]>([]);

  const unrevisedWords = useMemo(
    () => words.filter(w => !revisedIds.includes(w.id)),
    [words, revisedIds],
  );
  const selectedWord = SuperMemo.retrieveShortestInterval(unrevisedWords);

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
          words={unrevisedWords}
          selectedWord={selectedWord}
          setIsClicked={setIsClicked}
          setRevisedIds={setRevisedIds}
        />
      </main>
    </>
  );
}

type QuizStartServerSideProps = {
  words: Word[];
};

export const getServerSideProps: GetServerSideProps<
  QuizStartServerSideProps
> = async ({ locale, query }) => {
  const queryWords = query.words;
  const words = (queryWords ? JSON.parse(queryWords as string) : []) as Word[];

  return {
    props: {
      words,
      ...(await serverSideTranslations(
        locale ?? "en",
        ["common"],
        nextI18nConfig,
      )),
    },
  };
};
