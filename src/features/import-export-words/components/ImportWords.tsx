import { nanoid } from "nanoid";
import React from "react";
import { useTranslation } from "next-i18next";

import useWords from "~/hooks/useWords";
import { useToasts } from "~/features/toast";
import { ImportIcon } from "~/components/Icons";
import Button from "~/components/Button/Button";
import useHeaderData from "~/store/useHeaderData";
import ButtonUndo from "~/components/Button/ButtonUndo";
import { readFileAsync, useImportWords } from "~/features/import-export-words";

type ImportWordsProps = {
  className?: string;
};

export default function ImportWords({ className }: ImportWordsProps) {
  const words = useWords();
  const { t } = useTranslation();
  const { addToast, updateToast } = useToasts();
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
              updateToast(id, { isOpen: false });
            }}
          >
            {t("toast.undo")}
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
    <Button
      className={className}
      onClick={triggerInputHandler}
      data-testid="import-container"
    >
      <ImportIcon className="rotate-180" />
      {t("header.import")}
      <input
        type="file"
        className="hidden"
        aria-hidden={true}
        data-testid="input-import"
        onChange={importWordsHandler}
      />
    </Button>
  );
}
