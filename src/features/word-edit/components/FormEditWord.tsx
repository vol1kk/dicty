import { useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { type Word } from "~/types/ApiTypes";
import Button from "~/components/Button/Button";
import FormWord from "~/features/shared/ui/Form";
import { useCreateWord } from "~/features/word-add";
import ButtonUndo from "~/components/Button/ButtonUndo";
import { useDeleteWord, useUpdateWord } from "~/features/word-edit";
import {
  useToasts,
  toastDelete,
  toastUpdate,
  toastsCounter,
  incrementToastsCounter,
} from "~/features/toast";

export type FormEditWordProps = {
  word: Word;
};

export default function FormEditWord({ word }: FormEditWordProps) {
  const { t } = useTranslation();
  const navigation = useRouter();
  const { addToast, updateToast } = useToasts();

  const previousToast = useRef(toastsCounter[word.id] || 0);

  const closeToastOnSuccess = (id: string) =>
    updateToast(id, {
      isOpen: false,
    });

  const undoDelete = useCreateWord({
    onSuccess: closeToastOnSuccess.bind(undefined, `${toastDelete}-${word.id}`),
  });

  const undoUpdate = useUpdateWord({
    onSuccess() {
      if (previousToast.current)
        closeToastOnSuccess(
          `${toastUpdate}-${word.id}-${previousToast.current}`,
        );
    },
  });

  const updateWord = useUpdateWord({
    onSuccess() {
      // If previous toast exists, delete it
      if (previousToast)
        closeToastOnSuccess(
          `${toastUpdate}-${word.id}-${previousToast.current}`,
        );

      // Increment by 1 to have unique key
      const nextToast = incrementToastsCounter(
        word.id,
        previousToast,
        toastsCounter,
      );

      addToast({
        id: `${toastUpdate}-${word.id}-${nextToast}`,
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
        id: `${toastDelete}-${word.id}`,
        type: "warning",
        autoClose: 10000,
        text: t("toast.delete.success"),
        action: (
          <ButtonUndo onClick={undoDelete.bind(undefined, word)}>
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

  function deleteHandler(id: string) {
    deleteWord(id);
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
            disabled={!isValid}
            isSubmit={true}
            onClick={() => {
              if (isValid) setTimeout(handleFormReset, 500);
            }}
            className="hover:bg-green-500 hover:text-white disabled:cursor-no-drop dark:hover:bg-green-600"
          >
            {t("form.word.button.save")}
          </Button>
          <Button
            data-testid="button-back"
            className="hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500"
            onClick={() => void navigation.push("/")}
          >
            {t("form.word.button.cancel")}
          </Button>
          <Button
            data-testid="button-delete"
            onClick={deleteHandler.bind(undefined, word.id)}
            className="hover:bg-red-500 hover:text-white dark:hover:bg-red-500"
          >
            {t("form.word.button.delete")}
          </Button>
        </>
      )}
    />
  );
}
