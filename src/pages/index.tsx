import clsx from "clsx";
import Head from "next/head";
import SearchIcon from "~/components/Icons/SearchIcon";
import useUserPreferences from "~/store/useUserPreferences";
import WordsList from "~/components/WordsList/WordsList";

export default function Home() {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";
  function inputSearchHandler(e: React.MouseEvent) {
    e.preventDefault();
    console.log(1);
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
            className={clsx(
              isDarkTheme ? "bg-gray-800" : "bg-gray-100",
              `w-full rounded-xl p-4 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline`,
            )}
            type="text"
            placeholder="Search for your words..."
          />
          <button
            aria-hidden="true"
            onClick={inputSearchHandler}
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
          <WordsList />
        </div>
      </main>
    </>
  );
}
