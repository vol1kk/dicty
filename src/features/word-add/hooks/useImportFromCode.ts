import { useToasts } from "~/features/toast";
import { api } from "~/utils/api";

export default function useImportFromCode(callback: () => void) {
  const utils = api.useContext();
  const { addToast } = useToasts();

  const { mutate } = api.words.importFromCode.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.error);
      setTimeout(callback, 500);
      addToast({
        text: "Successfully imported the word!",
        autoClose: 5000,
        pauseOnBlur: true,
        pauseOnHover: true,
      });
    },
    onError(e) {
      addToast({
        type: "error",
        text: `Something went wrong! Error: ${e.message}`,
      });
    },
  });

  return mutate;
}
