import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import KeyIcon from "~/assets/key.svg";
import CloseIcon from "~/assets/close.svg";
import { useToasts } from "~/features/toast";
import Button from "~/components/Button/Button";
import { useToggleShareCode } from "~/features/words-list";

type WordShareProps = {
  code: string | null;
  wordId: string;
};

export default function WordShare({ code, wordId }: WordShareProps) {
  const { t } = useTranslation();
  const { addToast } = useToasts();
  const [shareCode, setShareCode] = useState(code);
  const formCodeRef = useRef<HTMLInputElement>(null);

  const { toggleShareCodeMutation } = useToggleShareCode({
    onSuccess(code: string | null) {
      setShareCode(code);
    },

    onError(e: string) {
      addToast({
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
    <div className="mx-auto mb-1 flex w-fit rounded-md bg-gray-300 p-2 dark:bg-gray-900">
      <input
        type="text"
        readOnly={true}
        ref={formCodeRef}
        key={shareCode ?? ""}
        onClick={inputClickHandler}
        tabIndex={shareCode ? 0 : -1}
        defaultValue={shareCode ?? ""}
        placeholder={t("form.code.generate")}
        className="mr-2 max-w-[18ch] border-r-[1px] border-r-[#adb2b8] bg-transparent pr-2 outline-0"
      />
      <Button onClick={buttonClickHandler} className="[&>svg]:fill-primary">
        {shareCode ? (
          <>
            <span className="sr-only">{t("form.code.delete")}</span>
            <CloseIcon />
          </>
        ) : (
          <>
            <span className="sr-only">{t("form.code.generate")}</span>
            <KeyIcon />
          </>
        )}
      </Button>
    </div>
  );
}