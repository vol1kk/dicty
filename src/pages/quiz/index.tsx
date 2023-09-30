import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Spinner from "~/components/Spinner";
import { Button } from "~/components/Button";
import { useWordsToRevise } from "~/features/quiz";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import RevisedWordsTable from "~/features/quiz/components/RevisedWordsTable";
import { useTranslation } from "next-i18next";

export default function QuizPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale === "en" ? "en-us" : "uk-ua";

  const { data: words, isLoading } = useWordsToRevise();

  function startRevision() {
    void router.push(
      {
        pathname: "/quiz/start",
        query: { words: JSON.stringify(words) },
      },
      "/quiz",
    );
  }

  return (
    <>
      <Head>
        <title>Dicty | Quiz</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="mb-4">
          <RevisedWordsTable locale={locale} />
        </section>
        <section className="flex justify-center">
          <Button
            className="w-full p-4 font-bold uppercase tracking-wide disabled:cursor-no-drop"
            disabled={isLoading || words.length === 0}
            onClick={startRevision}
          >
            {isLoading ? (
              <Spinner text="Loading" dimensions={16} />
            ) : (
              t("revisions.start")
            )}
          </Button>
        </section>
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
