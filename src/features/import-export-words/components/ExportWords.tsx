import React from "react";
import { useTranslation } from "next-i18next";

import useWords from "~/hooks/useWords";
import Button from "~/components/Button/Button";
import modifyWordId from "~/utils/modifyWordId";
import { ImportIcon } from "~/components/Icons";
import useHeaderData from "~/store/useHeaderData";
import { downloadData } from "~/features/import-export-words";

export default function ExportWords() {
  const { t } = useTranslation();
  const { data: words } = useWords();
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

  function exportWordsHandler() {
    const modifiedWords = words.map(w =>
      modifyWordId(w, { appendWithEmptyId: true }),
    );

    downloadData(modifiedWords, `words-${+new Date()}`);
    setIsHeaderOpen(false);
  }

  return (
    <Button data-testid="export-words-container" onClick={exportWordsHandler}>
      <ImportIcon width={24} height={24} />
      {t("header.export")}
    </Button>
  );
}
