import Head from "next/head";
import SearchIcon from "~/components/Icons/SearchIcon";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-10">
        <div className="relative">
          <input
            className="w-full rounded-xl bg-gray-100 p-4 text-lg placeholder:font-bold focus:outline-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            type="text"
            placeholder="Search for your words..."
          />
          <button
            className="group absolute right-0 top-1/2 -translate-y-1/2 p-4 outline-primary focus-visible:outline-2"
            type="button"
          >
            <label className="sr-only">Search button</label>
            <SearchIcon
              dimensions={30}
              className="hover:fill-primary group-focus-visible:fill-primary"
            />
          </button>
        </div>
      </main>
    </>
  );
}
