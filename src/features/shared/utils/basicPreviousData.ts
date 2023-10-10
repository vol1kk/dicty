import { type api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";

type ExtractedWordValues = Pick<Word, "id" | "dictionary">;

export default async function basicPreviousData(
  utils: ReturnType<typeof api.useContext>,
  data: ExtractedWordValues | ExtractedWordValues[],
) {
  let queryKey = null;
  let previousData = utils.words.getAll.getData(queryKey);

  if (!previousData) {
    if (Array.isArray(data)) queryKey = data.at(0)?.dictionary || null;
    else queryKey = data.dictionary || null;

    await utils.words.getAll.cancel(queryKey);

    previousData = utils.words.getAll.getData(queryKey);
  }

  const previousDictionaries = utils.words.getDictionaries.getData();
  return { previousData, previousDictionaries, queryKey };
}
