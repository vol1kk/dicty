import { api } from "~/utils/api";

type UseToggleShareCodeProps = {
  onSuccess(code: string | null): void;
  onError(e: string): void;
};

export default function useToggleShareCode({
  onError,
  onSuccess,
}: UseToggleShareCodeProps) {
  const { mutate: toggleShareCodeMutation } =
    api.words.toggleShareCode.useMutation({
      onSuccess(res) {
        onSuccess(res.shareCode);
      },

      onError(e) {
        onError(e.message);
      },
    });

  return { toggleShareCodeMutation };
}
