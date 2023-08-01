import React from "react";
import { useTranslation } from "next-i18next";

import Button from "~/components/Button/Button";
import useHeaderData from "~/store/useHeaderData";
import { ImportIcon, useImportWords } from "~/features/import-words";
import readFileAsync from "~/features/import-words/utils/readFileAsync";

export default function ImportWords() {
  const { t } = useTranslation();
  const importWords = useImportWords();
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

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
      .catch(console.error);

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
