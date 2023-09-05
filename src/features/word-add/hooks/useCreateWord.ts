import { getQueryKey } from "@trpc/react-query";

import { api } from "~/utils/api";
import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";

type UseCreateWordProps = {
  onSuccess?(): void;
  onError?(e: string): void;
};

type WordCreatedAtFixed = Omit<Word, "createdAt"> & {
  createdAt: Date;
};

export default function useCreateWord(props?: UseCreateWordProps) {
  const utils = api.useContext();
  const queryKey = getQueryKey(api.words.getAll);
  const isAuthed = useSessionData(state => state.isAuthed);

  const setLocalWords = useLocalData(state => state.setWords);

  const { mutate } = api.words.createWord.useMutation({
    async onMutate(word) {
      await utils.words.getAll.cancel();

      const modifiedWord = modifyWordId(word, {
        appendWithId: true,
      }) as WordCreatedAtFixed;
      modifiedWord.createdAt = new Date();

      const previousData = utils.words.getAll.getData();
      if (previousData) {
        const optimisticData = [modifiedWord, ...previousData];
        utils.words.getAll.setData(void queryKey, optimisticData);
      }

      return { previousData };
    },

    onSuccess() {
      if (props?.onSuccess) props.onSuccess();

      utils.words.invalidate().catch(console.error);
    },

    onError(e, _, context) {
      if (props?.onError) props.onError(e.message);
      if (context?.previousData)
        utils.words.getAll.setData(void queryKey, context.previousData);
    },
  });

  function createWord(word: Word) {
    if (isAuthed) mutate(modifyWordId(word, { appendWithEmptyId: true }));

    if (!isAuthed) {
      const wordWithId = {
        ...modifyWordId(word, { appendWithId: true }),
        createdAt: new Date(),
      };

      const _localWords = localStorage.getItem("words");
      const _parsedLocalWords = _localWords
        ? (JSON.parse(_localWords) as Word[])
        : [];

      localStorage.setItem(
        "words",
        JSON.stringify([wordWithId, ..._parsedLocalWords]),
      );
      setLocalWords([wordWithId, ..._parsedLocalWords]);

      if (props?.onSuccess) props.onSuccess();
    }
  }

  return createWord;
}
