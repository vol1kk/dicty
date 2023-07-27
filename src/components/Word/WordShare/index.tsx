import Button from "~/components/Button/Button";
import KeyIcon from "~/components/Icons/KeyIcon";
import { useState } from "react";
import CloseIcon from "~/components/Icons/CloseIcon";
import { api } from "~/utils/api";

type WordShareProps = {
  code: string | null;
  wordId: string;
};

export default function WordShare({ code, wordId }: WordShareProps) {
  const [shareCode, setShareCode] = useState(code);

  const { mutate: generateCodeMutation } =
    api.words.generateShareCode.useMutation({
      onSuccess(res) {
        setShareCode(res.shareCode as string | null);
      },
    });
  const { mutate: deleteCodeMutation } = api.words.deleteShareCode.useMutation({
    onSuccess() {
      setShareCode(null);
    },
  });

  return (
    <div className="mx-auto mb-1 flex w-fit rounded-md bg-gray-300 p-2 dark:bg-gray-900">
      <input
        className="mr-2 max-w-[18ch] border-r-[1px] border-r-[#adb2b8] bg-transparent pr-2 outline-0"
        onClick={e => e.currentTarget.select()}
        defaultValue={shareCode ?? undefined}
        placeholder="Generate Word Code"
        readOnly={true}
        type="text"
      />
      <Button>
        {shareCode ? (
          <CloseIcon
            onClick={() => deleteCodeMutation({ wordId })}
            className="fill-primary"
          />
        ) : (
          <KeyIcon
            onClick={() => generateCodeMutation({ wordId })}
            className="fill-primary"
          />
        )}
      </Button>
    </div>
  );
}
