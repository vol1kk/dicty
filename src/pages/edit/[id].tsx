import Head from "next/head";
import { useRouter } from "next/router";
import { useRouter as useNavigationRouter } from "next/navigation";
import Form from "~/components/Form/Form";
import useWords from "~/hooks/useWords";
import { type Word } from "~/types/ApiTypes";
import Button from "~/components/Button/Button";
import { type GetStaticPaths, type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import { useTranslation } from "next-i18next";

export default function EditPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const navigation = useNavigationRouter();

  const { data: words, deleteWord, updateWord } = useWords();
  const word = words.find(w => w.id === router.query.id);

  function submitHandler(data: Word) {
    if (!word) return;

    updateWord(data);

    navigation.replace("/");
  }

  function deleteHandler() {
    if (!word) return;

    deleteWord(word.id);

    navigation.replace("/");
  }

  if (!word) return <h1>placeholder</h1>;

  return (
    <>
      <Head>
        <title>Dicty | {word.name}</title>
        <meta name="description" content="Create your own dictionary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Form
            initialValues={word}
            submitHandler={submitHandler}
            renderButtons={(isValid, handleFormReset) => (
              <>
                <Button
                  isSubmit={true}
                  onClick={() => {
                    if (isValid) setTimeout(handleFormReset, 500);
                  }}
                  className="rounded-md bg-gray-300 dark:bg-gray-900"
                >
                  {t("form.word.button.save")}
                </Button>
                <Button onClick={() => navigation.push("/")}>
                  {t("form.word.button.cancel")}
                </Button>
                <Button
                  onClick={deleteHandler}
                  className="dark:hover:bg-red-500"
                >
                  {t("form.word.button.delete")}
                </Button>
              </>
            )}
          />
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
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
