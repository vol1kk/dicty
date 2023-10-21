import React from "react";
import { useTranslation } from "next-i18next";

import cn from "~/utils/cn";
import Spinner from "~/components/Spinner";
import type useWords from "~/hooks/useWords";
import { Button } from "~/components/Button";
import { ImportIcon } from "~/components/Icons";
import modifyWordId from "~/utils/modifyWordId";
import useHeaderData from "~/store/useHeaderData";
import { BaseRepetitionValues } from "~/features/quiz";
import { downloadData } from "~/features/import-export-words";

type ExportWordsProps = {
  className?: string;
  words: ReturnType<typeof useWords>;
};

export default function ExportWords({ className, words }: ExportWordsProps) {
  const { t } = useTranslation();

  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

  function exportWordsHandler() {
    const modifiedWords = words.data.map(w => ({
      ...modifyWordId(w, { appendWithEmptyId: true }),
      ...BaseRepetitionValues,
    }));

    downloadData(modifiedWords, `words-${+new Date()}`);
    setIsHeaderOpen(false);
  }

  return (
    <Button
      variant="darker"
      className={cn(
        className,
        "disabled:cursor-no-drop disabled:hover:scale-100",
      )}
      disabled={words.isLoading}
      onClick={exportWordsHandler}
      data-testid="export-words-container"
    >
      {words.isLoading ? (
        <Spinner dimensions={24} text={t("load")} />
      ) : (
        <ImportIcon width={24} height={24} />
      )}
      {t("export")}
    </Button>
  );
}
