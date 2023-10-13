import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { type Dispatch, type SetStateAction } from "react";

import cn from "~/utils/cn";
import { Button } from "~/components/Button";
import { ChevronIcon } from "~/components/Icons";
import setQueryParams from "~/utils/setQueryParams";
import { ItemsPerPage } from "~/features/sort-words";

type FilterByPageProps = {
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  wordsLength: number;
};

export default function FilterByPage({
  currentPage,
  setPage,
  wordsLength,
}: FilterByPageProps) {
  const router = useRouter();

  const { t } = useTranslation();

  const pages = Array.from(
    { length: Math.ceil(wordsLength / ItemsPerPage) },
    (_, ind) => ind + 1,
  );

  if (pages.length === 1 || wordsLength === 0) return;

  const currentPageIndex = pages.findIndex(p => p === currentPage);

  const previousIndex = currentPageIndex - 2 < 0 ? 0 : currentPageIndex - 2;

  const nextIndex =
    currentPageIndex + 3 > pages.length ? pages.length : currentPageIndex + 3;

  const pagesToShow = pages.slice(
    nextIndex === 9 ? 4 : previousIndex,
    previousIndex === 0 ? 5 : nextIndex,
  );

  function handlePageSelect(page: number) {
    setPage(page);
    setQueryParams(router, "page", page === 1 ? null : page.toString());
  }

  function handleButtonPageSelect(option: "previous" | "next") {
    let newPageValue = 0;

    if (option === "previous")
      setPage(prev => {
        const prevPage = prev - 1;
        newPageValue = prevPage;

        return prevPage;
      });

    if (option === "next")
      setPage(prev => {
        const prevPage = prev + 1;
        newPageValue = prevPage;

        return prevPage;
      });

    setQueryParams(
      router,
      "page",
      newPageValue === 1 ? null : newPageValue.toString(),
    );
  }

  return (
    <div className="mt-4 grid grid-cols-[1fr,_auto,_1fr] place-items-center gap-3 mobile:grid-cols-none mobile:grid-rows-[1fr] [&>button:hover]:bg-primary [&>button:hover]:dark:bg-primary [&>button:hover]:dark:bg-opacity-60 [&>button]:transition-colors">
      {currentPage > 1 && (
        <Button
          aria-label={t("page.previous")}
          onClick={handleButtonPageSelect.bind(undefined, "previous")}
          className="justify-self-end bg-transparent p-2 dark:bg-transparent mobile:justify-self-center"
        >
          <ChevronIcon width={18} className="rotate-180 mobile:-rotate-90" />
        </Button>
      )}
      <ol className="col-start-2 flex items-center justify-center gap-2 mobile:col-start-auto">
        {pagesToShow.map(page => (
          <li key={page} aria-label={`${t("page")} ${page}`}>
            <Button
              className={cn(
                page === currentPage &&
                  "bg-primary bg-opacity-60 dark:bg-primary dark:bg-opacity-60",
                "px-4 py-2 hover:bg-primary hover:bg-opacity-60 hover:dark:bg-primary hover:dark:bg-opacity-60",
              )}
              onClick={handlePageSelect.bind(undefined, page)}
            >
              {page}
            </Button>
          </li>
        ))}
      </ol>
      {currentPage < pages.length && (
        <Button
          aria-label={t("page.next")}
          onClick={handleButtonPageSelect.bind(undefined, "next")}
          className="justify-self-start bg-transparent p-2 dark:bg-transparent mobile:justify-self-center "
        >
          <ChevronIcon width={18} className="mobile:rotate-90" />
        </Button>
      )}
    </div>
  );
}
