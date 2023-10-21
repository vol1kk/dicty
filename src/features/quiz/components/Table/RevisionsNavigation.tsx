import { useTranslation } from "next-i18next";
import React, { type Dispatch, type SetStateAction } from "react";

import { Button } from "~/components/Button";
import { ChevronIcon } from "~/components/Icons";
import getFormattedDate from "~/utils/getFormattedDate";

type RevisionsNavigationProps = {
  locale: string;
  datesLength: number;
  selectedDate: string;
  revisionIndex: number;
  setRevisionInd: Dispatch<SetStateAction<number>>;
};

export default function RevisionsNavigation({
  locale,
  datesLength,
  selectedDate,
  revisionIndex,
  setRevisionInd,
}: RevisionsNavigationProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-[1fr,_1fr,_1fr] place-items-center gap-4 [&_button:hover>_svg]:dark:fill-primary [&_button:hover]:scale-110 [&_button]:rounded-full [&_button]:bg-primary [&_button]:bg-opacity-30 [&_button]:p-4 [&_button]:transition-transform [&_svg]:fill-primary [&_svg]:dark:fill-gray-600">
      {revisionIndex >= 1 && (
        <Button
          aria-label="Previous Revision"
          className="place-self-end self-center"
          onClick={() => setRevisionInd(prev => prev - 1)}
        >
          <ChevronIcon width={18} className="rotate-180" />
        </Button>
      )}
      <span className="col-start-2 grid ">
        <span className="text-sm font-bold tracking-widest text-primary dark:text-gray-600">
          {getFormattedDate(locale, selectedDate)}
        </span>
        {t("revisions.name", { count: 0 })}
      </span>
      {revisionIndex < datesLength - 1 && (
        <Button
          aria-label="Next Revision"
          className="place-self-start self-center"
          onClick={() => setRevisionInd(prev => prev + 1)}
        >
          <ChevronIcon width={18} />
        </Button>
      )}
    </div>
  );
}
