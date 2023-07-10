import clsx from "clsx";
import Head from "next/head";
import SearchIcon from "~/components/Icons/SearchIcon";
import useUserPreferences from "~/store/useUserPreferences";
import WordsList from "~/components/WordsList/WordsList";
import useDebounce from "~/hooks/useDebounce";
import { placeholder } from "~/utils/placeholder";
import { useMemo, useState } from "react";
import filterData from "~/utils/filterData";

export default function Home() {
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
          <button
            aria-hidden="true"
            className="group absolute right-0 top-1/2 -translate-y-1/2 rounded-lg p-3 outline-2 outline-primary focus-visible:outline"
            type="submit"
          >
            <SearchIcon
              aria-hidden="true"
              dimensions={30}
              className={clsx(
                isDarkTheme && "fill-primary",
                `hover:fill-primary group-focus-visible:fill-primary`,
              )}
            />
          </button>
        </form>
        <div className="mt-8">
          <WordsList data={data} />
        </div>
      </main>
    </>
  );
}
