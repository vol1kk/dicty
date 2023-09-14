import { type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "next-i18next";
import { SearchIcon } from "~/components/Icons";

export type SearchWordsProps = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

export default function FilterByWord({
  searchValue,
  setSearchValue,
}: SearchWordsProps) {
  const { t } = useTranslation();

  return (
    <div data-testid="search-words-container" className="relative mb-8">
      <input
        id="search"
        type="text"
        name="search"
        value={searchValue}
        data-testid="search-words-input"
        placeholder={t("word.sort.by_query")}
        onChange={e => setSearchValue(e.target.value.trim())}
        className="w-full rounded-xl bg-gray-100 p-4 pr-12 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline dark:bg-gray-800"
      />
      <SearchIcon
        height={36}
        width={36}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg fill-primary"
      />
    </div>
  );
}
