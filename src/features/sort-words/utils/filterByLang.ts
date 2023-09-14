import { type Word } from "~/types/ApiTypes";

export default function filterByLang(words: Word[], lang: null | string) {
  if (lang === null || lang?.endsWith("all")) return words;

  return words.filter(w => w.language?.toLowerCase() === lang);
}
