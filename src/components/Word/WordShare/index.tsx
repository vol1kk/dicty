import Button from "~/components/Button/Button";
import KeyIcon from "~/components/Icons/KeyIcon";
import { useRef, useState } from "react";
import CloseIcon from "~/components/Icons/CloseIcon";
import { api } from "~/utils/api";

type WordShareProps = {
  code: string | null;
  wordId: string;
};

export default function WordShare({ code, wordId }: WordShareProps) {
  const [shareCode, setShareCode] = useState(code);
  const formCodeRef = useRef<HTMLInputElement>(null);

  const { mutate: generateCodeMutation } =
    api.words.generateShareCode.useMutation({
      onSuccess(res) {
        console.log(res.shareCode);
        setShareCode(res.shareCode as string | null);
      },
    });
  const { mutate: deleteCodeMutation } = api.words.deleteShareCode.useMutation({
    onSuccess() {
      setShareCode(null);
    },
  });

  function clickHandler() {
    if (shareCode) deleteCodeMutation({ wordId });
    if (!shareCode) {
      generateCodeMutation({ wordId });
    }
  }

  return (
    <div className="mx-auto mb-1 flex w-fit rounded-md bg-gray-300 p-2 dark:bg-gray-900">
      <input
        type="text"
        readOnly={true}
        ref={formCodeRef}
        key={shareCode ?? ""}
        tabIndex={shareCode ? 0 : -1}
        defaultValue={shareCode ?? ""}
        placeholder="Generate Word Code"
        onClick={e => e.currentTarget.select()}
        className="mr-2 max-w-[18ch] border-r-[1px] border-r-[#adb2b8] bg-transparent pr-2 outline-0"
      />
      <Button onClick={clickHandler} className="[&>svg]:fill-primary">
        {shareCode ? (
          <>
            <span className="sr-only">Delete sharing code</span>
            <CloseIcon />
          </>
        ) : (
          <>
            <span className="sr-only">Generate sharing code</span>
            <KeyIcon />
          </>
        )}
      </Button>
    </div>
  );
}
