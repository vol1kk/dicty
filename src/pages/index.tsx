import Head from "next/head";
import { type GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { useMemo, useRef, useState } from "react";
import nextI18nConfig from "../../next-i18next.config.mjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import FormCodeShare from "~/components/Form/FormCodeShare";
import WordsList from "~/components/WordsList/WordsList";
import Accordion from "~/components/Accordion/Accordion";
import SearchIcon from "~/components/Icons/SearchIcon";
import Button from "~/components/Button/Button";
import useDebounce from "~/hooks/useDebounce";
import { type Word } from "~/types/ApiTypes";
import filterData from "~/utils/filterData";
import Form from "~/components/Form/Form";
import useWords from "~/hooks/useWords";

const formTemplate = {
  name: "",
  shareCode: null,
  transcription: "",
  categories: [
    { id: "", name: "", meanings: [{ id: "", definition: "", example: "" }] },
  ],
} as Word;

export default function Home() {
  const { t } = useTranslation("common");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputCodeRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: words, createWord } = useWords();
  const data = useMemo(
    () => filterData(words ?? [], debouncedSearch),
    [words, debouncedSearch],
  );

  function formCloseHandler() {
    if (inputCodeRef.current) inputCodeRef.current.value = "";
    setIsFormOpen(false);
  }

  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="relative">
          <input
            id="search"
            type="text"
            name="search"
            value={search}
            placeholder={t("searchWords")}
            onChange={e => setSearch(e.target.value.trim())}
            className="w-full rounded-xl bg-gray-100 p-4 pr-12 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline dark:bg-gray-800"
          />
          <SearchIcon
            dimensions={36}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg fill-primary"
          />
        </div>
        <div className="mt-8">
          <div
            aria-expanded={isFormOpen}
            className="group/accordionTitle mb-4 rounded-md bg-gray-100 dark:bg-gray-800"
          >
            <Button
              className="flex w-full items-center justify-center rounded-md p-4 text-xl !outline-offset-0"
              onClick={() => setIsFormOpen(p => !p)}
            >
              {t("form.word.button.add")}
              <span
                aria-hidden={true}
                className="ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-black text-2xl transition-transform  group-aria-expanded/accordionTitle:rotate-45 group-aria-expanded/accordionTitle:border-primary  group-aria-expanded/accordionTitle:text-primary dark:border-white dark:group-aria-expanded/accordionTitle:border-white"
              >
                +
              </span>
            </Button>
            <Accordion isOpen={isFormOpen}>
              <FormCodeShare
                ref={inputCodeRef}
                closeHandler={formCloseHandler}
              />
              <Form
                submitHandler={word => createWord(word)}
                initialValues={formTemplate}
                renderButtons={(isValid, handleFormReset) => {
                  function handleFormResetWrapper() {
                    formCloseHandler();
                    handleFormReset();
                  }

                  return (
                    <>
                      <Button
                        isSubmit={true}
                        onClick={() => {
                          if (isValid) setTimeout(handleFormResetWrapper, 500);
                        }}
                      >
                        {t("form.word.button.add")}
                      </Button>
                      <Button onClick={handleFormResetWrapper}>
                        {t("form.word.button.close")}
                      </Button>
                    </>
                  );
                }}
              />
            </Accordion>
          </div>
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
