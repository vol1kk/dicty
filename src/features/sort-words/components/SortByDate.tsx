import { useTranslation } from "next-i18next";
import React, { type SetStateAction } from "react";

import cn from "~/utils/cn";
import Dropdown from "~/components/Dropdown";
import { ChevronIcon } from "~/components/Icons";
import { SortNewest, SortOldest, SortValues } from "~/features/sort-words";

export type SortByDateType = "newest" | "oldest";

type SortWordsProps = {
  currentOrderByDate: SortByDateType;
  setOrderByDate: React.Dispatch<SetStateAction<SortByDateType>>;
};

export default function SortByDate({
  currentOrderByDate,
  setOrderByDate,
}: SortWordsProps) {
  const { t } = useTranslation();

  function sortByDateCallback(data: HTMLLIElement) {
    setOrderByDate(data.dataset.orderby as SortByDateType);
  }

  return (
    <Dropdown
      classNameContent="left-1 mobile:w-full mobile:left-0 mobile:px-2"
      className="rounded-md bg-primary bg-opacity-30 px-4 py-2 dark:bg-opacity-60"
      callback={sortByDateCallback}
      renderTitle={isDropdownOpen => (
        <div className="relative flex cursor-pointer items-center justify-center pl-4 mobile:py-1">
          <ChevronIcon
            width={14}
            height={14}
            className={cn(
              "absolute left-0 transition-transform [&>path]:fill-black dark:[&>path]:fill-white",
              isDropdownOpen && "rotate-90 [&>path]:fill-primary",
            )}
          />
          <span>
            {currentOrderByDate === "newest"
              ? t(SortNewest.name)
              : t(SortOldest.name)}
          </span>
        </div>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="word-sortbydate-list"
          className="mt-3 rounded-md bg-white p-3 shadow-3xl dark:bg-gray-900 [&>li]:leading-8"
        >
          {SortValues.map(type => {
            const isSameSortOrder =
              type.order.toLowerCase() === currentOrderByDate.toLowerCase();

            return (
              <li
                role="option"
                key={type.name}
                data-orderby={type.order}
                aria-selected={isSameSortOrder}
                tabIndex={isSameSortOrder ? 0 : -1}
                onClick={e => dropdownItemHandler(e)}
                className={`cursor-pointer whitespace-nowrap rounded-md px-12 py-1 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary mobile:text-center`}
              >
                {t(type.name)}
              </li>
            );
          })}
        </ul>
      )}
    />
  );
}
