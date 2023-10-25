import { useTranslation } from "next-i18next";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import useDebounce from "~/hooks/useDebounce";
import { SearchIcon } from "~/components/Icons";
import useSetQueryParams from "~/hooks/useSetQueryParams";

export type SearchWordsProps = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

export default function FilterByWord({
  searchValue,
  setSearchValue,
}: SearchWordsProps) {
  const setQueryParams = useSetQueryParams();

  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearchValue = useDebounce(localSearch, 300);

  useEffect(() => setLocalSearch(searchValue), [searchValue]);
  useEffect(() => {
    setSearchValue(debouncedSearchValue);

    setQueryParams(
      "q",
      debouncedSearchValue === "" ? null : debouncedSearchValue,
    );
  }, [debouncedSearchValue, setSearchValue]); // eslint-disable-line

  const { t } = useTranslation();

  return (
    <div data-testid="search-words-container" className="relative mb-8">
      <input
        id="search"
        type="text"
        name="search"
        value={localSearch}
        data-testid="search-words-input"
        placeholder={t("input.search_word")}
        onChange={e => setLocalSearch(e.target.value)}
        className="w-full rounded-xl bg-gray-100 p-4 pr-12 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline dark:bg-gray-800"
      />
      <SearchIcon
        height={36}
        width={36}
        aria-hidden
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg fill-primary"
      />
    </div>
  );
}
