import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";
import { getQueryKey } from "@trpc/react-query";

type WordCreatedAtFixed = Omit<Word, "createdAt"> & {
  createdAt: Date;
};

export default function useImportWords(props?: Partial<HookOptions>) {
  const utils = api.useContext();
  const queryKey = getQueryKey(api.words.getAll);

  const localWords = useLocalData(state => state.words);
  const isAuthed = useSessionData(state => state.isAuthed);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: importWordsMutation } = api.words.importWords.useMutation({
    async onMutate(words) {
      await utils.words.getAll.cancel();

      const modifiedWord = words.map(word =>
        modifyWordId(word, {
          appendWithId: true,
        }),
      ) as WordCreatedAtFixed[];

      const previousData = utils.words.getAll.getData();
      if (previousData) {
        const optimisticData = [...modifiedWord, ...previousData];
        utils.words.getAll.setData(void queryKey, optimisticData);
      }

      return { previousData };
    },

    onSuccess() {
      if (props?.onSuccess) props.onSuccess();

      utils.words.getAll.invalidate().catch(console.log);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);

      if (context?.previousData)
        utils.words.getAll.setData(void queryKey, context.previousData);
    },
  });

  const { mutate: undoImportWordsMutation } =
    api.words.undoImportWords.useMutation({
      async onMutate(words) {
        await utils.words.getAll.cancel();

        const previousData = utils.words.getAll.getData();
        if (previousData) {
          utils.words.getAll.setData(
            void queryKey,
            words as WordCreatedAtFixed[],
          );
        }

        return { previousData };
      },

      onSuccess() {
        utils.words.getAll.invalidate().catch(console.log);
      },

      onError(e, _, context) {
        if (props?.onError) props.onError(e.message);

        if (context?.previousData)
          utils.words.getAll.setData(void queryKey, context.previousData);
      },
    });

  function importWords(words: Word[]) {
    if (isAuthed) {
      const wordsWithEmptyIds = words.map(w =>
        modifyWordId(w, { appendWithEmptyId: true }),
      );

      importWordsMutation(wordsWithEmptyIds);
    }

    if (!isAuthed) {
      const wordsWithId = words.map(w =>
        modifyWordId(w, { appendWithId: true }),
      );

      setLocalWords([...localWords, ...wordsWithId]);
      localStorage.setItem(
        "words",
        JSON.stringify([...localWords, ...wordsWithId]),
      );

      if (props?.onSuccess) props.onSuccess();
    }
  }

  function undoImport(words: Word[]) {
    if (isAuthed) {
      const wordsWithEmptyIds = words.map(w =>
        modifyWordId(w, { appendWithEmptyId: true }),
      );

      undoImportWordsMutation(wordsWithEmptyIds);
    }

    if (!isAuthed) {
      const wordsWithId = words.map(w =>
        modifyWordId(w, { appendWithId: true }),
      );

      setLocalWords(wordsWithId);
      localStorage.setItem("words", JSON.stringify(wordsWithId));
    }
  }

  return { importWords, undoImport };
}
