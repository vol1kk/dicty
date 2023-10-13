import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import { useToasts } from "~/features/toast";
import { Button } from "~/components/Button";
import { CloseIcon, KeyIcon } from "~/components/Icons";
import { useToggleShareCode } from "~/features/word-edit";

export type WordShareProps = {
  code: string | null;
  wordId: string;
};

export default function WordShare({ code, wordId }: WordShareProps) {
  const { t } = useTranslation();
  const { toast } = useToasts();
  const [shareCode, setShareCode] = useState(code);
  const formCodeRef = useRef<HTMLInputElement>(null);

  const { toggleShareCodeMutation } = useToggleShareCode({
    onSuccess(code: string | null) {
      setShareCode(code);
    },

    onError(e: string) {
      toast.error({
        type: "error",
        autoClose: false,
        text: t("toast.toggleCode.error", { error: e }),
      });
    },
  });

  function inputClickHandler(e: React.MouseEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.currentTarget.select();
  }

  const buttonClickHandler = () => toggleShareCodeMutation({ wordId });

  return (
    <div
      data-testid="word-share"
      className="mx-auto mb-1 flex w-fit rounded-md bg-gray-300 p-2 dark:bg-gray-900"
    >
      <input
        type="text"
        id={`${wordId}-code`}
        name={`${wordId}-code`}
        key={shareCode}
        readOnly={true}
        ref={formCodeRef}
        onClick={inputClickHandler}
        tabIndex={shareCode ? 0 : -1}
        defaultValue={shareCode ?? ""}
        placeholder={t("form.code.generate")}
        className="mr-2 w-full max-w-[18ch] border-r-[1px] border-r-[#adb2b8] bg-transparent pr-2 outline-0"
      />
      <Button
        onClick={buttonClickHandler}
        aria-label={t(shareCode ? "form.code.delete" : "form.code.generate")}
        className="bg-transparent dark:bg-transparent [&>svg]:fill-primary"
      >
        {shareCode ? <CloseIcon aria-hidden /> : <KeyIcon aria-hidden />}
      </Button>
    </div>
  );
}
