import Head from "next/head";
import { type GetStaticProps } from "next";
import { useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useWords from "~/hooks/useWords";
import useDebounce from "~/hooks/useDebounce";
import FormAddWord from "~/features/word-add";
import SearchWords from "~/features/search-words";
import { WordsList } from "~/features/words-list";
import { filterData } from "~/features/search-words";
import nextI18nConfig from "~/../next-i18next.config.mjs";

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: words, isLoading } = useWords();
  const filteredWords = useMemo(
    () => filterData({ data: words, query: debouncedSearch }),
    [words, debouncedSearch],
  );

  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main data-testid="home-main">
        <SearchWords searchValue={search} setSearchValue={setSearch} />
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
