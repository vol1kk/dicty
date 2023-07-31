import SearchIcon from "~/components/Icons/SearchIcon";
import { type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "next-i18next";

type SearchWordsProps = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

export default function SearchWords({
  searchValue,
  setSearchValue,
}: SearchWordsProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <input
        id="search"
        type="text"
        name="search"
        value={searchValue}
        placeholder={t("searchWords")}
        onChange={e => setSearchValue(e.target.value.trim())}
        className="w-full rounded-xl bg-gray-100 p-4 pr-12 text-lg outline-2 outline-offset-2 outline-primary placeholder:font-bold focus-visible:outline dark:bg-gray-800"
      />
      <SearchIcon
        dimensions={36}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg fill-primary"
      />
    </div>
  );
}
