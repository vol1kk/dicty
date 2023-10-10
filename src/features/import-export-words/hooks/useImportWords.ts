import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";
import { basicErrorCallback, basicPreviousData } from "~/features/shared/utils";

export default function useImportWords(props?: Partial<HookOptions>) {
  const utils = api.useContext();

  const isAuthed = useSessionData(state => state.isAuthed);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: importWordsMutation } = api.words.importWords.useMutation({
    onSuccess() {
      if (props?.onSuccess) props.onSuccess();

      utils.words.invalidate().catch(console.log);
    },

    onError(e) {
      if (props?.onError) props.onError(e.message);
    },
  });

  const { mutate: undoImportWordsMutation } =
    api.words.undoImportWords.useMutation({
      async onMutate(words) {
        await utils.words.getAll.cancel();

        utils.words.getAll.setData(null, words);

        const { previousDictionaries, previousData, queryKey } =
          await basicPreviousData(utils, words);

        return { previousDictionaries, previousData, queryKey };
      },

      onSuccess() {
        utils.words.invalidate().catch(console.log);
      },

      onError(e, _, context) {
        if (props?.onError) props.onError(e.message);

        if (context) basicErrorCallback({ utils, context });
      },
    });

  function importWords(words: Word[]) {
    const modifiedWords = words.map(w =>
      modifyWordId(w, { appendWithId: true }),
    );

    if (isAuthed) importWordsMutation(modifiedWords);

    if (!isAuthed) {
      setLocalWords(data => {
        const newState = [...data, ...modifiedWords];
        localStorage.setItem("words", JSON.stringify(newState));

        return newState;
      });

      if (props?.onSuccess) props.onSuccess();
    }
  }

  function undoImport(words: Word[]) {
    if (isAuthed) undoImportWordsMutation(words);

    if (!isAuthed) {
      setLocalWords(words);
      localStorage.setItem("words", JSON.stringify(words));
    }
  }

  return { importWords, undoImport };
}
