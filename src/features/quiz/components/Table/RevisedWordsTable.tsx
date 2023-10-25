import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import cn from "~/utils/cn";
import parseDate from "~/utils/parseDate";
import { useToasts } from "~/features/toast";
import NotFound from "~/components/NotFound";
import { useUpdateWord } from "~/features/word-edit";
import getFormattedDate from "~/utils/getFormattedDate";
import { Button, ButtonUndo } from "~/components/Button";
import {
  type RevisedWord,
  setRevisedWords,
} from "~/features/quiz/store/useRevisedWords";
import {
  BaseRepetitionValues,
  RevisionsNavigation,
  useGetRevisedWords,
} from "~/features/quiz";

export default function RevisedWordsTable({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const { toast, updateToast } = useToasts();

  const [previousResetWord, setPreviousResetWord] =
    useState<null | RevisedWord>(null);

  const undoUpdate = useUpdateWord({
    onSuccess() {
      if (!previousResetWord) return;
      updateToast(previousResetWord.id, { isOpen: false });
    },
  });

  const updateWord = useUpdateWord({
    onSuccess() {
      toast.warning({
        id: previousResetWord?.id,
        text: t("toast.revision.reset"),
        action: (
          <ButtonUndo
            onClick={() => {
              if (previousResetWord)
                handleRevisionReset(previousResetWord, true);
            }}
          >
            {t("undo")}
          </ButtonUndo>
        ),
      });
    },
  });

  const [revisionIndex, setRevisionInd] = useState(0);

  const revisedWords = useGetRevisedWords(setRevisionInd);
  const revisionDates = Object.keys(revisedWords);

  const selectedDate = revisionDates[revisionIndex];
  if (!selectedDate)
    return <NotFound dimensions={36} text={t("revisions.not_found")} />;

  const selectedRevision = (revisedWords[selectedDate] as RevisedWord[]).map(
    parseDate,
  );
  console.log(selectedRevision);

  function handleRevisionReset(word: RevisedWord, undo = false) {
    if (!selectedDate) return;

    setPreviousResetWord(word);
    setRevisedWords(
      { ...word, ...(!undo && { interval: undefined }) },
      word.quality,
      selectedDate,
    );

    if (undo && previousResetWord) undoUpdate(previousResetWord);
    else
      updateWord({
        id: word.id,
        ...BaseRepetitionValues,
      });
  }

  const strikeThroughClasses =
    "relative before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-black dark:before:bg-white";

  return (
    <table className="w-full table-fixed border-separate border-spacing-0 [&_tr>*]:p-2 [&_tr]:text-center">
      <caption className="mb-2 text-3xl">
        <RevisionsNavigation
          locale={locale}
          selectedDate={selectedDate}
          revisionIndex={revisionIndex}
          setRevisionInd={setRevisionInd}
          datesLength={revisionDates.length}
        />
      </caption>
      <thead className="rounded-md first:[&_th]:rounded-l-md last:[&_th]:rounded-r-md [&_tr]:bg-gray-300 dark:[&_tr]:bg-gray-800">
        <tr>
          <th>{t("revisions.word")}</th>
          <th>{t("revisions.prev_rating")}</th>
          <th>{t("revisions.next_revision")}</th>
        </tr>
      </thead>
      <tbody className="even:[&>tr]:bg-gray-300 dark:even:[&>tr]:bg-gray-800 last:[&_td]:rounded-r-md [&_th]:rounded-l-md">
        {selectedRevision?.map(w => (
          <tr key={w.id}>
            <th
              scope="row"
              className={cn(
                "text-left",
                !w.interval && [strikeThroughClasses, "before:left-2"],
              )}
            >
              {w.name}
            </th>
            <td className={cn(!w.interval && strikeThroughClasses)}>
              {t("quality." + w.quality.toLowerCase())}
            </td>
            <td
              className={cn(
                "relative",
                !w.interval && [strikeThroughClasses, "before:-left-2"],
              )}
            >
              <div className="grid auto-rows-auto place-items-center">
                {w.interval && (
                  <span>
                    {getFormattedDate(locale, w.interval, {
                      dateStyle: "medium",
                    })}
                  </span>
                )}
                <Button
                  onClick={() => handleRevisionReset(w)}
                  className={cn(
                    "rounded-sm bg-transparent text-xs uppercase tracking-widest underline dark:bg-transparent",
                    !w.interval && "pointer-events-none",
                  )}
                >
                  {t("reset")}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
