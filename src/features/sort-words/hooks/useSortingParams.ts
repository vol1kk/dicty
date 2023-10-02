import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { type SortByDateType } from "~/features/sort-words";

// Forced to do THAT, because router.query doesn't immediately have the value there,
// however, it's present in asPath
// Fun fact: works in app router using useSearchParams
export default function useSortingParams() {
  const router = useRouter();
  const rawQuery = router.asPath.slice(2).split("&");

  const dictionaryKey = "dict=";
  const langKey = "lang=";
  const dateOrderKey = "order=";

  const orderQuery = rawQuery.find(query => query.startsWith(dateOrderKey));
  const initialOrder = (orderQuery?.slice(dateOrderKey.length) ||
    "newest") as SortByDateType;
  const [orderByDate, setOrderByDate] = useState<SortByDateType>(initialOrder);

  const langQuery = rawQuery.find(query => query.startsWith(langKey));
  const initialLanguage = langQuery?.slice(langKey.length) || null;
  const [lang, setLang] = useState<null | string>(initialLanguage);

  const dictionaryQuery = rawQuery.find(query =>
    query.startsWith(dictionaryKey),
  );
  const initialDictionary =
    dictionaryQuery?.slice(dictionaryKey.length) || null;
  const [dicty, setDicty] = useState(initialDictionary);

  useEffect(() => {
    setOrderByDate(initialOrder);
    setLang(initialLanguage);
    setDicty(initialDictionary);
  }, [initialOrder, initialLanguage, initialDictionary]);

  return {
    lang: [lang, setLang],
    dictionary: [dicty, setDicty],
    date: [orderByDate, setOrderByDate],
  } as const;
}
