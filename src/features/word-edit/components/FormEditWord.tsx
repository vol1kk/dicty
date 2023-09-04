import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { type Word } from "~/types/ApiTypes";
import { useToasts } from "~/features/toast";
import Button from "~/components/Button/Button";
import FormWord from "~/features/shared/ui/Form";
import { useCreateWord } from "~/features/word-add";
import ButtonUndo from "~/components/Button/ButtonUndo";
import { useDeleteWord, useUpdateWord } from "~/features/word-edit";

export type FormEditWordProps = {
  word: Word;
};

export default function FormEditWord({ word }: FormEditWordProps) {
  const { t } = useTranslation();
  const navigation = useRouter();
  const { addToast, updateToast } = useToasts();

  const undoDelete = useCreateWord({
    onSuccess() {
      updateToast("toast-" + word.id, { isOpen: false });
    },
  });

  const undoUpdate = useUpdateWord({
    onSuccess() {
      updateToast("toast-" + word.id, { isOpen: false });
    },
  });

  const updateWord = useUpdateWord({
    onSuccess() {
      addToast({
        id: `toast-${word.id}`,
        type: "warning",
        autoClose: 10000,
        text: t("toast.update.success"),
        action: (
          <ButtonUndo onClick={undoUpdate.bind(undefined, word)}>
            {t("toast.undo")}
          </ButtonUndo>
        ),
      });
    },

    onError(e: string) {
      addToast({
        type: "error",
        autoClose: false,
        text: t("toast.update.error", { error: e }),
      });
    },
  });

  const deleteWord = useDeleteWord({
    onSuccess() {
      addToast({
        id: `toast-` + word.id,
        type: "warning",
        autoClose: 10000,
        text: t("toast.delete.success"),
        action: (
          <ButtonUndo onClick={() => undoDelete(word)}>
            {t("toast.undo")}
          </ButtonUndo>
        ),
      });
    },

    onError(e: string) {
      addToast({
        type: "error",
        autoClose: false,
        text: t("toast.delete.error", { error: e }),
      });
    },
  });

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
            data-testid="button-save"
            isSubmit={true}
            onClick={() => {
              if (isValid) setTimeout(handleFormReset, 500);
            }}
            className="rounded-md bg-gray-300 dark:bg-gray-900"
          >
            {t("form.word.button.save")}
          </Button>
          <Button
            data-testid="button-back"
            onClick={() => void navigation.push("/")}
          >
            {t("form.word.button.cancel")}
          </Button>
          <Button
            data-testid="button-delete"
            onClick={deleteHandler}
            className="hover:bg-red-500 hover:text-white"
          >
            {t("form.word.button.delete")}
          </Button>
        </>
      )}
    />
  );
}
