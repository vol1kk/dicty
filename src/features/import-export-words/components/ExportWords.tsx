import React from "react";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/router";
import useWords from "~/hooks/useWords";
import Button from "~/components/Button/Button";
import modifyWordId from "~/utils/modifyWordId";
import { ImportIcon } from "~/components/Icons";
import useHeaderData from "~/store/useHeaderData";
import { downloadData } from "~/features/import-export-words";

type ExportWordsProps = {
  className?: string;
};

export default function ExportWords({ className }: ExportWordsProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

  const { data: words } = useWords({
    enabled: router.pathname === "/" ? true : isHeaderOpen,
  });

  function exportWordsHandler() {
    const modifiedWords = words.map(w =>
      modifyWordId(w, { appendWithEmptyId: true }),
    );

    downloadData(modifiedWords, `words-${+new Date()}`);
    setIsHeaderOpen(false);
  }

  return (
    <Button
      className={className}
      onClick={exportWordsHandler}
      data-testid="export-words-container"
    >
      <ImportIcon width={24} height={24} />
      {t("header.export")}
    </Button>
  );
}
