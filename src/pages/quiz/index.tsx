import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Spinner from "~/components/Spinner";
import NotFound from "~/components/NotFound";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import { useWordsToRevise } from "~/features/quiz";
import useRevisedWords, {
  type RevisedWord,
} from "~/features/quiz/store/useRevisedWords";

export default function QuizPage() {
  const { data: words, isLoading } = useWordsToRevise();
  const setRevisedWords = useRevisedWords(state => state.setRevisedWords);

  useEffect(() => {
    const localData = localStorage.getItem("revisedWords");
    const currentDate = new Date().toISOString();

    if (localData) {
      const parsedData = JSON.parse(localData) as Record<string, RevisedWord[]>;
      const revisedToday = parsedData[currentDate];
      if (revisedToday) setRevisedWords(revisedToday);
    }
  }, [setRevisedWords]);

  if (isLoading)
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

  return (
    <>
      <Head>
        <title>Dicty | Quiz</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link
          as="/quiz"
          href={{
            pathname: "/quiz/start",
            query: { words: JSON.stringify(words) },
          }}
        >
          Test
        </Link>
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
