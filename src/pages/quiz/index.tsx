import Head from "next/head";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { type GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import cn from "~/utils/cn";
import getLocale from "~/utils/getLocale";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/Button";
import { useWordsToRevise } from "~/features/quiz";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import RevisedWordsTable from "~/features/quiz/components/Table/RevisedWordsTable";
import {
  FilterByDictionary,
  getUniqueDictionaries,
} from "~/features/sort-words";

export default function QuizPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = getLocale(router.locale || "en");

  const [dict, setDict] = useState<string | null>(
    router.query.dict ? (router.query.dict as string) : null,
  );

  const { data: words, isLoading } = useWordsToRevise(dict);
  const availableDictionaries = getUniqueDictionaries(words);

  function startRevision() {
    void router.push(
      {
        pathname: "/quiz/start",
        query: { words: JSON.stringify(words), dict },
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
        <section className="relative flex flex-col justify-center gap-2 [&>div>div:last-child]:w-full [&>div>div>ul>li]:text-center">
          <Button
            className={cn(
              words.length === 0 && "text-green-500",
              "w-full bg-gray-300 p-4 font-bold uppercase tracking-wide disabled:cursor-no-drop",
            )}
            disabled={isLoading || words.length === 0}
            onClick={startRevision}
          >
            {isLoading ? (
              <Spinner text="Loading" dimensions={23} />
            ) : words.length === 0 ? (
              t("revisions.all_revised")
            ) : (
              t("revisions.start")
            )}
          </Button>
          {availableDictionaries.length !== 0 && (
            <FilterByDictionary
              setDictionary={setDict}
              currentDictionary={dict}
              availableDictionaries={availableDictionaries}
              dropdownContentStyles="grid grid-cols-2 mobile-header:grid-cols-1"
            />
          )}
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
