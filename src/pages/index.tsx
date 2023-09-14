import Head from "next/head";
import { useMemo, useState } from "react";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useWords from "~/hooks/useWords";
import useDebounce from "~/hooks/useDebounce";
import FormAddWord from "~/features/word-add";
import { WordsList } from "~/features/words-list";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import {
  useSortingParams,
  FilterByLang,
  filterByLang,
  FilterByWord,
  filterByWord,
  SortByDate,
  sortByDate,
} from "~/features/sort-words";

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const {
    lang: [lang, setLang],
    date: [orderByDate, setOrderByDate],
  } = useSortingParams();

  const { data: words, isLoading } = useWords();

  const availableLanguages = [
    ...new Set(words.map(w => w.language?.toLowerCase())),
  ] as string[];

  const filteredWords = useMemo(() => {
    const sortedByDate = sortByDate(words, orderByDate);
    const filteredByLang = filterByLang(sortedByDate, lang);

    return filterByWord({
      data: filteredByLang,
      query: debouncedSearch,
    });
  }, [words, lang, orderByDate, debouncedSearch]);

  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main data-testid="home-main">
        <FilterByWord searchValue={search} setSearchValue={setSearch} />
        {availableLanguages?.length > 0 && (
          <div className="relative mb-2.5 flex justify-between mobile:flex-col mobile:gap-2 [&>*]:min-w-[150px]">
            <SortByDate
              currentOrderByDate={orderByDate}
              setOrderByDate={setOrderByDate}
            />
            {availableLanguages?.length > 1 && (
              <FilterByLang
                currentLang={lang}
                availableLanguages={availableLanguages.filter(w => w)}
                setLang={setLang}
              />
            )}
          </div>
        )}
        <FormAddWord />
        <WordsList data={filteredWords} isLoading={isLoading} />
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
