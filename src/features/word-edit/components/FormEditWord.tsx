import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { type Word } from "~/types/ApiTypes";
import { Button } from "~/components/Button";
import Form from "~/features/shared/ui/Form";
import { useCreateWord } from "~/features/word-add";
import ButtonUndo from "~/components/Button/ButtonUndo";
import useToastCounter from "~/features/toast/store/useToastCounter";
import { useToasts, toastDelete, toastUpdate } from "~/features/toast";
import {
  useDeleteWord,
  useUpdateWord,
  type UseDeleteWordInputs,
} from "~/features/word-edit";

export type FormEditWordProps = {
  word: Word;
};

export default function FormEditWord({ word }: FormEditWordProps) {
  const { t } = useTranslation();
  const navigation = useRouter();

  const getToastCounter = useToastCounter(state => state.getToastCounter);
  const setToastCounter = useToastCounter(state => state.setToastCounter);

  const prevToast = getToastCounter(word.id);
  const { toasts, toast, updateToast, removeToast } = useToasts();

  const closeToastOnSuccess = (id: string) =>
    updateToast(id, {
      isOpen: false,
    });

  const undoDelete = useCreateWord({
    onSuccess: closeToastOnSuccess.bind(undefined, `${toastDelete}-${word.id}`),
  });

  const undoUpdate = useUpdateWord({
    onSuccess: closeToastOnSuccess.bind(
      undefined,
      `${toastUpdate}-${word.id}-${prevToast}`,
    ),
  });

  const updateWord = useUpdateWord({
    onSuccess() {
      // If previous toast exists, delete it
      if (prevToast !== undefined)
        closeToastOnSuccess(`${toastUpdate}-${word.id}-${prevToast}`);

      setToastCounter(word.id);
      const nextToast = getToastCounter(word.id);

      toast.warning({
        id: `${toastUpdate}-${word.id}-${nextToast}`,
        text: t("toast.update.success"),
        action: (
          <ButtonUndo onClick={undoUpdate.bind(undefined, word)}>
            {t("toast.undo")}
          </ButtonUndo>
        ),
      });
    },

    onError(e: string) {
      const optimisticToast = toasts.find(
        t => t.id === `${toastDelete}-${word.id}`,
      );

      if (optimisticToast) removeToast(optimisticToast.id);

      toast.error({
        text: t("toast.update.error", { error: e }),
      });
    },
  });

  const deleteWord = useDeleteWord({
    onSuccess() {
      toast.warning({
        id: `${toastDelete}-${word.id}`,
        text: t("toast.delete.success"),
        action: (
          <ButtonUndo onClick={undoDelete.bind(undefined, word)}>
            {t("toast.undo")}
          </ButtonUndo>
        ),
      });
    },

    onError(e: string) {
      const optimisticToast = toasts.find(
        t => t.id === `${toastDelete}-${word.id}`,
      );

      if (optimisticToast) removeToast(optimisticToast.id);

      toast.error({
        text: t("toast.delete.error", { error: e }),
      });
    },
  });

  function submitHandler(data: Word) {
    updateWord(data);
    void navigation.back();
  }

  function deleteHandler(data: UseDeleteWordInputs) {
    deleteWord(data);
    void navigation.replace("/");
  }

  return (
    <Form
      initialValues={word}
      submitHandler={submitHandler}
      renderButtons={(isValid, handleFormReset) => (
        <>
          <Button
            variant="darker"
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
            variant="darker"
            data-testid="button-back"
            className="hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500"
            onClick={() => void navigation.back()}
          >
            {t("form.word.button.cancel")}
          </Button>
          <Button
            variant="darker"
            data-testid="button-delete"
            onClick={() =>
              deleteHandler({
                id: word.id,
                dictionary: word.dictionary,
              })
            }
            className="hover:bg-red-500 hover:text-white dark:hover:bg-red-500"
          >
            {t("form.word.button.delete")}
          </Button>
        </>
      )}
    />
  );
}
