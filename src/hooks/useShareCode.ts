import { api } from "~/utils/api";

export default function useShareCode(callback: (data: string | null) => void) {
  const { mutate: generateCodeMutation } =
    api.words.generateShareCode.useMutation({
      onSuccess(res) {
        callback(res.shareCode);
      },
    });

  const { mutate: deleteCodeMutation } = api.words.deleteShareCode.useMutation({
    onSuccess() {
      callback(null);
    },
  });

  return { generateCodeMutation, deleteCodeMutation };
}
