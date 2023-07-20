import Head from "next/head";
import { useMemo, useState } from "react";
import WordsList from "~/components/WordsList/WordsList";
import Accordion from "~/components/Accordion/Accordion";
import SearchIcon from "~/components/Icons/SearchIcon";
import Button from "~/components/Button/Button";
import useDebounce from "~/hooks/useDebounce";
import { type Word } from "~/types/ApiTypes";
import filterData from "~/utils/filterData";
import wordWithId from "~/utils/wordWithId";
import Form from "~/components/Form/Form";
import useWords from "~/hooks/useWords";
import useHeaderData from "~/store/useHeaderData";
import clsx from "clsx";

const formTemplate = {
  name: "",
  transcription: "",
  categories: [
    { id: "", name: "", meanings: [{ id: "", definition: "", example: "" }] },
  ],
} as Word;

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const words = useWords();

  const data = useMemo(
    () => filterData(words.data ?? [], debouncedSearch),
    [words, debouncedSearch],
  );

  const formSubmitHandler = function formSubmitHandler(word: Word) {
    if ("fromApi" in words && !words.fromApi) {
      const withId = wordWithId(word);
      words.setWords(p => [withId, ...p]);
      localStorage.setItem("words", JSON.stringify([withId, ...words.data]));
    }

    if ("fromApi" in words && words.fromApi)
      words.createWord(wordWithId(word, true));
  };

  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={clsx(isHeaderOpen && "invisible")}>
        <div className="relative">
          <input
            id="search"
            type="text"
            name="search"
            value={search}
            placeholder="Search for your words..."
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
              Add word
              <span
                aria-hidden={true}
                className="ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-black text-2xl transition-transform  group-aria-expanded/accordionTitle:rotate-45 group-aria-expanded/accordionTitle:border-primary  group-aria-expanded/accordionTitle:text-primary dark:border-white dark:group-aria-expanded/accordionTitle:border-white"
              >
                +
              </span>
            </Button>
            <Accordion isOpen={isFormOpen}>
              <Form
                submitHandler={formSubmitHandler}
                initialValues={formTemplate}
                renderButtons={(isValid, handleFormReset) => {
                  const handleFormResetWrapper = () => {
                    setIsFormOpen(false);
                    handleFormReset();
                  };

                  return (
                    <>
                      <Button
                        isSubmit={true}
                        onClick={() => {
                          if (isValid) setTimeout(handleFormResetWrapper, 500);
                        }}
                      >
                        Add Word
                      </Button>
                      <Button onClick={handleFormResetWrapper}>Close</Button>
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
