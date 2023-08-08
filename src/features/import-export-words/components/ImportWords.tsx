import { nanoid } from "nanoid";
import React from "react";
import { useTranslation } from "next-i18next";

import useWords from "~/hooks/useWords";
import { useToasts } from "~/features/toast";
import Button from "~/components/Button/Button";
import useHeaderData from "~/store/useHeaderData";
import {
  ImportIcon,
  readFileAsync,
  useImportWords,
} from "~/features/import-export-words";
import ButtonUndo from "~/components/Button/ButtonUndo";

export default function ImportWords() {
  const words = useWords();
  const { t } = useTranslation();
  const { addToast, removeToast } = useToasts();
  const { importWords, undoImport } = useImportWords({
    onError,
    onSuccess() {
      const id = nanoid();

      addToast({
        id,
        type: "warning",
        autoClose: 10000,
        text: t("toast.import.success", { count: 0 }),
        action: (
          <ButtonUndo
            onClick={() => {
              undoImport(words.data);
              removeToast(id);
            }}
          >
            Undo
          </ButtonUndo>
        ),
      });
    },
  });
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

  function onError(e: string) {
    addToast({
      type: "error",
      autoClose: false,
      text: t("toast.import.error", { count: 0, error: e }),
    });
  }

  function triggerInputHandler(e: React.MouseEvent) {
    const fileInput = e.currentTarget.querySelector(
      "input[type=file]",
    ) as HTMLInputElement;
    fileInput.click();
  }

  function importWordsHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    readFileAsync(file)
      .then(data => importWords(data))
      .catch((error: Error) => onError(error.message));

    setIsHeaderOpen(false);
  }

  return (
    <Button onClick={triggerInputHandler}>
      <ImportIcon className="rotate-180" />
      {t("header.import")}
      <input
        onChange={importWordsHandler}
        className="hidden"
        aria-hidden={true}
        type="file"
      />
    </Button>
  );
}
