import { nanoid } from "nanoid";
import React from "react";
import { useTranslation } from "next-i18next";

import type useWords from "~/hooks/useWords";
import { useToasts } from "~/features/toast";
import { Button } from "~/components/Button";
import { ImportIcon } from "~/components/Icons";
import useHeaderData from "~/store/useHeaderData";
import ButtonUndo from "~/components/Button/ButtonUndo";
import { readFileAsync, useImportWords } from "~/features/import-export-words";

type ImportWordsProps = {
  className?: string;
  words: ReturnType<typeof useWords>;
};

export default function ImportWords({ className, words }: ImportWordsProps) {
  const { t } = useTranslation();
  const { addToast, updateToast } = useToasts();

  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

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
      variant="darker"
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
