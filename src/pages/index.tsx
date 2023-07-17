import Head from "next/head";
import { useMemo, useState } from "react";
import WordsList from "~/components/WordsList/WordsList";
import Accordion from "~/components/Accordion/Accordion";
import SearchIcon from "~/components/Icons/SearchIcon";
import { placeholder, type Word } from "~/utils/placeholder";
import Button from "~/components/Button/Button";
import useDebounce from "~/hooks/useDebounce";
import filterData from "~/utils/filterData";
import Form from "~/components/Form/Form";
import useWords from "~/hooks/useGetWords";

const formTemplate: Word = {
  id: "",
  name: "",
  createdById: "",
  transcription: "",
  categories: [
    { id: "", name: "", meanings: [{ id: "", definition: "", example: "" }] },
  ],
};

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [words, setWords] = useWords();

  const data = useMemo(
    () => filterData(words, debouncedSearch),
    [words, debouncedSearch],
  );

  function formSubmitHandler(word: Word) {
    setWords(p => {
      const newWords = [word, ...p];
      localStorage.setItem("words", JSON.stringify(newWords));

      return newWords;
    });
  }

  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <form className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value.trim())}
            className="w-full rounded-xl bg-gray-100 p-4 pr-12 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline dark:bg-gray-800"
            type="text"
            placeholder="Search for your words..."
          />
          <Button
            tabIndex={-1}
            className="group absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-3"
          >
            <SearchIcon
              dimensions={30}
              className="hover:fill-primary group-focus-visible:fill-primary dark:fill-primary"
            />
          </Button>
        </form>
        <div className="mt-8">
          <div
            aria-expanded={isFormOpen}
            className="group mb-4 rounded-md bg-gray-100 dark:bg-gray-800"
          >
            <Button
              className="flex w-full items-center justify-center p-4 text-xl"
              onClick={() => setIsFormOpen(p => !p)}
            >
              Add word
              <span
                aria-hidden={true}
                className="ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-black text-2xl transition-transform  group-aria-expanded:rotate-45 group-aria-expanded:border-primary  group-aria-expanded:text-primary dark:border-white dark:group-aria-expanded:border-white"
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
