import { useRouter } from "next/router";
import { useRouter as useNavigationRouter } from "next/navigation";
import Form from "~/components/Form/Form";
import useWords from "~/hooks/useGetWords";
import { type Word } from "~/utils/placeholder";
import Button from "~/components/Button/Button";

export default function EditPage() {
  const [words] = useWords();
  const router = useRouter();
  const word = words.find(w => w.id === router.query.id);
  const navigation = useNavigationRouter();

  function submitHandler(data: Word) {
    const changedWords = words.map(w => (w.id === data.id ? data : w));
    localStorage.setItem("words", JSON.stringify(changedWords));
    navigation.replace("/");
  }

  function deleteHandler() {
    let changedWords = words;
    if (word) changedWords = words.filter(w => w.id !== word.id);

    localStorage.setItem("words", JSON.stringify(changedWords));
    navigation.replace("/");
  }

  if (!word) return <h1>placeholder</h1>;

  return (
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
              <Button onClick={deleteHandler} className="dark:hover:bg-red-500">
                Del
              </Button>
            </>
          )}
        />
      </div>
    </main>
  );
}
