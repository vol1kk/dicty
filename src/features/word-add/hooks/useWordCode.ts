import { api } from "~/utils/api";

export default function useWordCode(callback: () => void) {
  const utils = api.useContext();

  const { mutate } = api.words.importFromCode.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.error);
      setTimeout(callback, 500);
    },
  });

  return mutate;
}
