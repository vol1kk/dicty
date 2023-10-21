import Head from "next/head";
import { useMemo, useRef } from "react";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useWords from "~/hooks/useWords";
import FormAddWord from "~/features/word-add";
import FetchOnceOptions from "~/utils/FetchOnceOptions";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import { ScrollToTop, WordsList } from "~/features/words-list";
import {
  FilterByDictionary,
  useSortingParams,
  useDictionaries,
  ItemsPerPage,
  FilterByPage,
  FilterByLang,
  filterByLang,
  FilterByWord,
  filterByWord,
  SortByDate,
  sortByDate,
} from "~/features/sort-words";

export default function Home() {
  const {
    lang: [lang, setLang],
    page: [page, setPage],
    order: [orderByDate, setOrderByDate],
    query: [searchQuery, setSearchQuery],
    dictionary: [dicty, setDicty],
  } = useSortingParams();

  const wordsListRef = useRef<HTMLLIElement>(null);

  const { data: words, isLoading } = useWords(dicty, FetchOnceOptions);
  const { data: availableDictionaries } = useDictionaries(FetchOnceOptions);

  const availableLanguages = [
    ...new Set(words.map(w => w.language?.toLowerCase())),
  ] as string[];

  const filteredWords = useMemo(() => {
    const sortedByDate = sortByDate(words, orderByDate);
    const filteredByLang = filterByLang(sortedByDate, lang);

    return filterByWord({
      data: filteredByLang,
      query: searchQuery,
    });
  }, [words, lang, orderByDate, searchQuery]);

  const start = (page - 1) * ItemsPerPage;
  const end = start + ItemsPerPage;

  const paginatedWords = filteredWords.slice(start, end);

  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main data-testid="home-main">
        <FilterByWord
          searchValue={searchQuery}
          setSearchValue={setSearchQuery}
        />
        <section className="relative mb-2.5 grid auto-cols-fr grid-flow-col gap-x-6 gap-y-2 mobile-header:grid-flow-row">
          <SortByDate
            currentOrderByDate={orderByDate}
            setOrderByDate={setOrderByDate}
          />
          <FilterByDictionary
            currentDictionary={dicty}
            setDictionary={setDicty}
            availableDictionaries={availableDictionaries}
          />
          <FilterByLang
            currentLang={lang}
            setLang={setLang}
            availableLanguages={availableLanguages.filter(w => w)}
          />
        </section>
        <FormAddWord />
        <section>
          <WordsList
            ref={wordsListRef}
            data={paginatedWords}
            isLoading={isLoading}
          />
          <FilterByPage
            currentPage={page}
            setPage={setPage}
            wordsLength={filteredWords.length}
          />
        </section>
        <ScrollToTop ref={wordsListRef} isLoading={isLoading} />
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
