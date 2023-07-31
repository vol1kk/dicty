import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { type GetStaticPaths, type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import FormEditWord from "~/features/word-edit";
import Spinner from "~/components/Spinner/Spinner";
import NotFound from "~/components/NotFound/NotFound";
import nextI18nConfig from "~/../next-i18next.config.mjs";
import useWordById from "~/hooks/useWordById";

export default function EditPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const wordId = typeof router.query.id === "string" ? router.query.id : "";
  const { data: word, isLoading } = useWordById(wordId);

  let noData;
  if (isLoading) noData = <Spinner dimensions={64} />;
  if (!word) noData = <NotFound dimensions={128} text={t("list.not-found")} />;

  if (isLoading || !word) {
    return (
      <>
        <Head>
          <title>Dicty | {isLoading ? "Loading" : "Not Found"}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="grid place-content-center">{noData}</main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dicty | {word.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <FormEditWord word={word} />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? "en",
      ["common"],
      nextI18nConfig,
    )),
  },
});
