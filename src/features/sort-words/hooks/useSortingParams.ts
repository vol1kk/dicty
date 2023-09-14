import { useRouter } from "next/router";
import { type SortByDateType } from "~/features/sort-words";
import { useEffect, useState } from "react";

export default function useSortingParams() {
  const router = useRouter();

  const initialDateOrder = (router.query.order as SortByDateType) || "newest";
  const [orderByDate, setOrderByDate] =
    useState<SortByDateType>(initialDateOrder);

  const initialLang = (router.query.lang as string) || null;
  const [lang, setLang] = useState<null | string>(initialLang);

  useEffect(() => {
    setLang(initialLang);
    setOrderByDate(initialDateOrder);
  }, [initialLang, initialDateOrder]);

  return {
    date: [orderByDate, setOrderByDate],
    lang: [lang, setLang],
  } as const;
}
