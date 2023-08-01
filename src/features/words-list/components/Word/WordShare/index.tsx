import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import KeyIcon from "~/assets/key.svg";
import CloseIcon from "~/assets/close.svg";
import Button from "~/components/Button/Button";
import useShareCode from "~/hooks/useShareCode";

type WordShareProps = {
  code: string | null;
  wordId: string;
};

export default function WordShare({ code, wordId }: WordShareProps) {
  const { t } = useTranslation();
  const [shareCode, setShareCode] = useState(code);
  const formCodeRef = useRef<HTMLInputElement>(null);

  const { generateCodeMutation, deleteCodeMutation } =
    useShareCode(setShareCode);

  function inputClickHandler(e: React.MouseEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.currentTarget.select();
  }

  function buttonClickHandler(e: React.MouseEvent) {
    e.stopPropagation();

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
