import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { type GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Spinner from "~/components/Spinner";
import NotFound from "~/components/NotFound";
import useWordById from "~/hooks/useWordById";
import FormEditWord from "~/features/word-edit";
import nextI18nConfig from "~/../next-i18next.config.mjs";

export default function EditPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const wordId = typeof router.query.id === "string" ? router.query.id : "";
  const { data: word, isLoading } = useWordById(wordId);

  let noData;
  if (!word) noData = <NotFound dimensions={128} text={t("list.not-found")} />;
  if (isLoading) noData = <Spinner text={t("spinner.load")} dimensions={64} />;

  if (isLoading || !word)
    return (
      <>
        <Head>
          <title>Dicty | {isLoading ? "Loading" : "Not Found"}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="grid place-content-center">{noData}</main>
      </>
    );

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

export const getServerSideProps: GetServerSideProps<object> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? "en",
      ["common"],
      nextI18nConfig,
    )),
  },
});
