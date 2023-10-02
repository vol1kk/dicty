import React from "react";
import { useTranslation } from "next-i18next";

import type useWords from "~/hooks/useWords";
import Button from "~/components/Button/Button";
import modifyWordId from "~/utils/modifyWordId";
import { ImportIcon } from "~/components/Icons";
import useHeaderData from "~/store/useHeaderData";
import { downloadData } from "~/features/import-export-words";

type ExportWordsProps = {
  className?: string;
  words: ReturnType<typeof useWords>;
};

export default function ExportWords({ className, words }: ExportWordsProps) {
  const { t } = useTranslation();

  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

  function exportWordsHandler() {
    const modifiedWords = words.data.map(w =>
      modifyWordId(w, { appendWithEmptyId: true }),
    );

    downloadData(modifiedWords, `words-${+new Date()}`);
    setIsHeaderOpen(false);
  }

  return (
    <Button
      variant="darker"
      className={className}
      onClick={exportWordsHandler}
      data-testid="export-words-container"
    >
      <ImportIcon width={24} height={24} />
      {t("header.export")}
    </Button>
  );
}
