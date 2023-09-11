import { type Word } from "~/types/ApiTypes";

export default function filterByLang(words: Word[], lang: null | string) {
  if (lang === "words.sort.by_lang.all" || lang === null) return words;

  return words.filter(w => w.language?.toLowerCase() === lang);
}
