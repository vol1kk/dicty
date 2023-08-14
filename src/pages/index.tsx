import Head from "next/head";
import { type GetStaticProps } from "next";
import { useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useWords from "~/hooks/useWords";
import Spinner from "~/components/Spinner";
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
  const data = useMemo(
    () => filterData(words, debouncedSearch),
    [words, debouncedSearch],
  );

  if (isLoading)
    return (
      <>
        <Head>
          <title>Dicty | Loading </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="grid place-content-center">
          <Spinner dimensions={64} text={`${t("spinner.load")}...`} />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SearchWords searchValue={search} setSearchValue={setSearch} />
        <div className="mt-8">
          <FormAddWord />
          <WordsList data={data} />
        </div>
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
