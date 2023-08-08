import { api } from "~/utils/api";
import { type HookOptions } from "~/types/HookOptions";

export default function useImportFromCode({ onError, onSuccess }: HookOptions) {
  const utils = api.useContext();

  const { mutate } = api.words.importFromCode.useMutation({
    onSuccess() {
      utils.words.invalidate().then(onSuccess).catch(console.error);
    },
    onError(e) {
      onError(e.message);
    },
  });

  return mutate;
}
