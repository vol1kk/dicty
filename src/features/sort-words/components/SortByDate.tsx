import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { type SetStateAction } from "react";

import cn from "~/utils/cn";
import Dropdown from "~/components/Dropdown";
import { ChevronIcon } from "~/components/Icons";
import setQueryParams from "~/utils/setQueryParams";
import { SortNewest, SortOldest, SortValues } from "~/features/sort-words";

export type SortByDateType = "newest" | "oldest";

export type SortByDateProps = {
  currentOrderByDate: SortByDateType;
  setOrderByDate: React.Dispatch<SetStateAction<SortByDateType>>;
};

export default function SortByDate({
  currentOrderByDate,
  setOrderByDate,
}: SortByDateProps) {
  const router = useRouter();
  const { t } = useTranslation();

  function sortByDateCallback(data: HTMLLIElement) {
    const orderByDate = data.dataset.orderby as SortByDateType;

    setOrderByDate(orderByDate);
    setQueryParams(router, "order", orderByDate);
  }

  return (
    <Dropdown
      classNameTitle="relative flex cursor-pointer items-center justify-center pl-4 mobile-header:py-1"
      classNameContent="left-1 mobile-header:w-full mobile-header:left-0 mobile-header:px-2"
      className="rounded-md bg-primary bg-opacity-30 px-4 py-2 dark:bg-opacity-60"
      callback={sortByDateCallback}
      renderTitle={isDropdownOpen => (
        <div>
          <ChevronIcon
            width={14}
            height={14}
            aria-hidden
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
                data-testid={"order-" + type.order}
                tabIndex={isSameSortOrder ? 0 : -1}
                onClick={e => dropdownItemHandler(e)}
                className={`cursor-pointer whitespace-nowrap rounded-md px-12 py-1 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary mobile-header:text-center`}
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
