import clsx from "clsx";
import Head from "next/head";
import { useMemo, useState } from "react";
import WordsList from "~/components/WordsList/WordsList";
import Accordion from "~/components/Accordion/Accordion";
import SearchIcon from "~/components/Icons/SearchIcon";
import { placeholder } from "~/utils/placeholder";
import Button from "~/components/Button/Button";
import useDebounce from "~/hooks/useDebounce";
import filterData from "~/utils/filterData";
import Form from "~/components/Form/Form";

const formTemplate = {
  name: "",
  transcription: "",
  categories: [{ name: "", meanings: [{ definition: "", example: "" }] }],
};

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const data = useMemo(
    () => filterData(placeholder, debouncedSearch),
    [debouncedSearch],
  );

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
            className="w-full rounded-xl bg-gray-100 p-4 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline dark:bg-gray-800"
            type="text"
            placeholder="Search for your words..."
          />
          <Button
            tabIndex={-1}
            className="group absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-3"
            type="submit"
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
            className="accordion mb-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800"
          >
            <Button
              className="flex w-full items-center justify-center text-xl"
              onClick={() => setIsFormOpen(p => !p)}
            >
              Add word
              <span
                aria-hidden={true}
                className={clsx(
                  isFormOpen && "rotate-45 border-primary text-primary",
                  "ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-black text-2xl  transition-transform dark:border-white",
                )}
              >
                +
              </span>
            </Button>
            <Accordion isOpen={isFormOpen}>
              <Form
                setIsFormOpen={setIsFormOpen}
                initialValues={formTemplate}
              />
            </Accordion>
          </div>
          <WordsList data={data} />
        </div>
      </main>
    </>
  );
}
