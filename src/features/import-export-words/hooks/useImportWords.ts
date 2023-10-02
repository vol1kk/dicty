import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import { type HookOptions } from "~/types/HookOptions";

export default function useImportWords(props?: Partial<HookOptions>) {
  const utils = api.useContext();

  const isAuthed = useSessionData(state => state.isAuthed);
  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate: importWordsMutation } = api.words.importWords.useMutation({
    onSuccess() {
      if (props?.onSuccess) props.onSuccess();

      utils.words.getAll.invalidate().catch(console.log);
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

        const previousData = utils.words.getAll.getData();
        return { previousData };
      },

      onSuccess() {
        utils.words.getAll.invalidate().catch(console.log);
      },

      onError(e, _, context) {
        if (props?.onError) props.onError(e.message);

        if (context?.previousData)
          utils.words.getAll.setData(null, context.previousData);
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
