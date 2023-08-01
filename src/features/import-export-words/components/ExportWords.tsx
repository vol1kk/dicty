import React from "react";
import { useTranslation } from "next-i18next";

import useWords from "~/hooks/useWords";
import Button from "~/components/Button/Button";
import modifyWordId from "~/utils/modifyWordId";
import downloadData from "~/utils/downloadData";
import useHeaderData from "~/store/useHeaderData";
import { ImportIcon } from "~/features/import-export-words";

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
    <Button onClick={exportWordsHandler}>
      <ImportIcon dimensions={24} />
      {t("header.export")}
    </Button>
  );
}
