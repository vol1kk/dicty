import Head from "next/head";
import { useRouter } from "next/router";
import { useRouter as useNavigationRouter } from "next/navigation";
import Form from "~/components/Form/Form";
import useWords from "~/hooks/useWords";
import { type Word } from "~/types/ApiTypes";
import Button from "~/components/Button/Button";
import useHeaderData from "~/store/useHeaderData";
import clsx from "clsx";

export default function EditPage() {
  const router = useRouter();
  const words = useWords();
  const navigation = useNavigationRouter();

  const word = words.data?.find(w => w.id === router.query.id);

  const submitHandler = function submitHandler(data: Word) {
    if (!words.data || !word) return;

    if (words.fromApi) words.updateWord(data);

    if (!words.fromApi) {
      const changedWords = words.data.map(w => (w.id === data.id ? data : w));
      localStorage.setItem("words", JSON.stringify(changedWords));
    }

    navigation.replace("/");
  };

  const deleteHandler = function deleteHandler() {
    if (!words.data || !word) return;

    if (words.fromApi) words.deleteWord({ id: word.id });

    if (!words.fromApi) {
      const filteredWords = words.data.filter(w => w.id !== word.id);
      localStorage.setItem("words", JSON.stringify(filteredWords));
    }

    navigation.replace("/");
  };

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
                  Save Changes
                </Button>
                <Button onClick={() => navigation.push("/")}>Cancel</Button>
                <Button
                  onClick={deleteHandler}
                  className="dark:hover:bg-red-500"
                >
                  Delete
                </Button>
              </>
            )}
          />
        </div>
      </main>
    </>
  );
}
