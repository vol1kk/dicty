import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { type Word } from "~/types/ApiTypes";
import FormWord from "~/features/shared/ui/Form";
import Button from "~/components/Button/Button";
import { useDeleteWord, useUpdateWord } from "~/features/word-edit";

type FormEditWord = {
  word: Word;
};

export default function FormEditWord({ word }: FormEditWord) {
  const { t } = useTranslation();
  const navigation = useRouter();

  const updateWord = useUpdateWord();
  const deleteWord = useDeleteWord();

  function submitHandler(data: Word) {
    updateWord(data);
    navigation.replace("/").catch(console.error);
  }

  function deleteHandler() {
    deleteWord(word.id);
    navigation.replace("/").catch(console.error);
  }

  return (
    <FormWord
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
          <Button onClick={() => void navigation.push("/")}>
            {t("form.word.button.cancel")}
          </Button>
          <Button onClick={deleteHandler} className="dark:hover:bg-red-500">
            {t("form.word.button.delete")}
          </Button>
        </>
      )}
    />
  );
}
