import { useRouter as useNavigationRouter } from "next/navigation";
import useWords from "~/hooks/useGetWords";
import Form from "~/components/Form/Form";
import { type Word } from "~/utils/placeholder";
import { useRouter } from "next/router";

export default function EditPage() {
  const router = useRouter();
  const navigation = useNavigationRouter();
  const [words] = useWords();
  const word = words.find(w => w.id === router.query.id);

  function submitHandler(data: Word) {
    const newWords = words.map(word => (word.id === data.id ? data : word));
    localStorage.setItem("words", JSON.stringify(newWords));
    navigation.replace("/");
  }

  if (!word) return <h1>placeholder</h1>;

  return (
    <main>
      <div className="rounded-md bg-gray-800 p-4">
        <Form initialValues={word} submitHandler={submitHandler} />
      </div>
    </main>
  );
}
