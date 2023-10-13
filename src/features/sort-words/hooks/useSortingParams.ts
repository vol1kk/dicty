import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { type SortByDateType } from "~/features/sort-words";

// Forced to do THAT,
// because https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization#how-it-works
// Not really sure whether it's okay tho...
// Fun fact: works in app router using useSearchParams
export default function useSortingParams() {
  const router = useRouter();

  const rawQuery = router.asPath.split("/?")[1];
  const searchParams = new URLSearchParams(rawQuery);

  const initialPage = Number.parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(initialPage);

  const initialOrder = (searchParams.get("order") ||
    "newest") as SortByDateType;
  const [orderByDate, setOrderByDate] = useState<SortByDateType>(initialOrder);

  const initialLanguage = searchParams.get("lang") || null;
  const [lang, setLang] = useState<null | string>(initialLanguage);

  const initialDictionary = searchParams.get("dict") || null;
  const [dicty, setDicty] = useState(initialDictionary);

  useEffect(() => {
    setOrderByDate(initialOrder);
    setLang(initialLanguage);
    setDicty(initialDictionary);
    setPage(initialPage);
  }, [initialPage, initialOrder, initialLanguage, initialDictionary]);

  return {
    lang: [lang, setLang],
    page: [page, setPage],
    dictionary: [dicty, setDicty],
    date: [orderByDate, setOrderByDate],
  } as const;
}
