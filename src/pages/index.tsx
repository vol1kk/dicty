import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dicty</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-10">
        <input
          className="w-full rounded-xl bg-gray-100 p-4 text-lg placeholder:font-bold focus:outline-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          type="text"
          placeholder="Search for your words..."
        />
      </main>
    </>
  );
}
