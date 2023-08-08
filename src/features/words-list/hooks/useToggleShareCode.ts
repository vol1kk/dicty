import { api } from "~/utils/api";

export default function useToggleShareCode(
  callback: (data: string | null) => void,
) {
  const { mutate: toggleShareCodeMutation } =
    api.words.toggleShareCode.useMutation({
      onSuccess(res) {
        callback(res.shareCode);
      },
    });

  return { toggleShareCodeMutation };
}
