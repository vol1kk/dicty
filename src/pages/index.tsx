import clsx from "clsx";
import Head from "next/head";
import SearchIcon from "~/components/Icons/SearchIcon";
import useUserPreferences from "~/store/useUserPreferences";
import WordsList from "~/components/WordsList/WordsList";
import useDebounce from "~/hooks/useDebounce";
import { placeholder } from "~/utils/placeholder";
import { useMemo, useState } from "react";
import filterData from "~/utils/filterData";
import Accordion from "~/components/Accordion/Accordion";
import Button from "~/components/Button/Button";
import Form from "~/components/Form/Form";

const formTemplate = {
  name: "",
  transcription: "",
  categories: [{ name: "", meanings: [{ definition: "", example: "" }] }],
};

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

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
            className={clsx(
              isDarkTheme ? "bg-gray-800" : "bg-gray-100",
              `w-full rounded-xl p-4 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline`,
            )}
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
              className={clsx(
                isDarkTheme && "fill-primary",
                `hover:fill-primary group-focus-visible:fill-primary`,
              )}
            />
          </Button>
        </form>
        <div className="mt-8">
          <div
            className={clsx(
              isDarkTheme ? "bg-gray-800" : "bg-gray-100",
              `accordion mb-4 rounded-md p-4`,
            )}
          >
            <Button
              className="flex w-full items-center justify-center text-xl"
              onClick={() => setIsFormOpen(p => !p)}
            >
              Add word
              <span
                aria-hidden={true}
                className={clsx(
                  isDarkTheme ? "border-white" : "border-black",
                  isFormOpen && "rotate-45 border-primary text-primary",
                  "ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full border-2  text-2xl transition-transform",
                )}
              >
                +
              </span>
            </Button>
            <Accordion isOpen={isFormOpen}>
              <Form isFormOpen={isFormOpen} initialValues={formTemplate} />
            </Accordion>
          </div>
          <WordsList data={data} />
        </div>
      </main>
    </>
  );
}
