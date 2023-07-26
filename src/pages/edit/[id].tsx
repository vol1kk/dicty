import Head from "next/head";
import { useRouter } from "next/router";
import { useRouter as useNavigationRouter } from "next/navigation";
import Form from "~/components/Form/Form";
import useWords from "~/hooks/useWords";
import { type Word } from "~/types/ApiTypes";
import Button from "~/components/Button/Button";

export default function EditPage() {
  const router = useRouter();
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
