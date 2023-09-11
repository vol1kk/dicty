import Head from "next/head";
import { type GetStaticProps } from "next";
import { useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useWords from "~/hooks/useWords";
import useDebounce from "~/hooks/useDebounce";
import FormAddWord from "~/features/word-add";
import { WordsList } from "~/features/words-list";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import {
  FilterByLang,
  filterByLang,
  FilterByWord,
  filterByWord,
  SortByDate,
  sortByDate,
  type SortByDateType,
} from "~/features/sort-words";

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [orderByDate, setOrderByDate] = useState<SortByDateType>("newest");
  const [lang, setLang] = useState<null | string>(null);

  const { data: words, isLoading } = useWords();

  const availableLanguages = [
    ...new Set(words.filter(w => w.language).map(w => w.language)),
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
        {!isLoading && (
          <div className="relative mb-2.5 flex justify-between">
            <SortByDate
              currentOrderByDate={orderByDate}
              setOrderByDate={setOrderByDate}
            />
            {availableLanguages?.length > 0 && (
              <FilterByLang
                currentLang={lang}
                availableLanguages={availableLanguages}
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
