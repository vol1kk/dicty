import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import parseDate from "~/utils/parseDate";
import { Button } from "~/components/Button";
import { ChevronIcon } from "~/components/Icons";
import useRevisedWords, {
  type RevisedWord,
} from "~/features/quiz/store/useRevisedWords";

type RevisedWordsTableProps = {
  locale: string;
};

export default function RevisedWordsTable({ locale }: RevisedWordsTableProps) {
  const { t } = useTranslation();
  const revisedWords = useRevisedWords(state => state.revisedWords);
  const setRevisedWords = useRevisedWords(state => state.setRevisedWords);

  const revisionDates = Object.keys(revisedWords);
  const [dateKeyInd, setDateKeyInd] = useState(0);

  useEffect(() => {
    const localData = localStorage.getItem("revisedWords");

    if (localData) {
      const parsedData = JSON.parse(localData) as Record<string, RevisedWord[]>;
      const parsedDates = Object.keys(parsedData);

      const today = new Date().toLocaleDateString("en-us");
      const revisedWordsTodayInd = parsedDates.findIndex(d => d === today);

      setDateKeyInd(
        revisedWordsTodayInd !== 1
          ? revisedWordsTodayInd
          : parsedDates.length - 1,
      );
      setRevisedWords(parsedData);
    }
  }, [setRevisedWords]);

  const selectedDate = revisionDates[dateKeyInd];
  if (!selectedDate) return <main>test</main>;

  const selectedFormattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
  }).format(new Date(selectedDate) || new Date());
  const selectedRevision = revisedWords[selectedDate]?.map(parseDate);

  return (
    <table className="w-full table-fixed border-separate border-spacing-0 [&_tr>*]:p-2 [&_tr]:text-center">
      <caption className="mb-2 text-3xl">
        <div className="grid grid-cols-[1fr,_1fr,_1fr] place-items-center gap-4 [&_button:hover>_svg]:dark:fill-primary [&_button:hover]:scale-110 [&_button]:rounded-full [&_button]:bg-primary [&_button]:bg-opacity-30 [&_button]:p-4 [&_button]:transition-transform [&_svg]:fill-primary [&_svg]:dark:fill-gray-600">
          {dateKeyInd >= 1 && (
            <Button
              aria-label="Previous Revision"
              className="place-self-end self-center"
              onClick={() => setDateKeyInd(prev => prev - 1)}
            >
              <ChevronIcon width={18} className="rotate-180" />
            </Button>
          )}
          <span className="col-start-2 grid ">
            <span className="text-sm font-bold tracking-widest text-primary dark:text-gray-600">
              {selectedFormattedDate}
            </span>
            {t("revisions.name")}
          </span>
          {dateKeyInd < revisionDates.length - 1 && (
            <Button
              aria-label="Next Revision"
              className="place-self-start self-center"
              onClick={() => setDateKeyInd(prev => prev + 1)}
            >
              <ChevronIcon width={18} />
            </Button>
          )}
        </div>
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
            <th scope="row" className="text-left">
              {w.name}
            </th>
            <td>{t("quality." + w.quality.toLowerCase())}</td>
            <td>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "medium",
              }).format(w.interval)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
