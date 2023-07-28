import Button from "~/components/Button/Button";
import KeyIcon from "~/components/Icons/KeyIcon";
import { useRef, useState } from "react";
import CloseIcon from "~/components/Icons/CloseIcon";
import { api } from "~/utils/api";
import { useTranslation } from "next-i18next";

type WordShareProps = {
  code: string | null;
  wordId: string;
};

export default function WordShare({ code, wordId }: WordShareProps) {
  const { t } = useTranslation();
  const [shareCode, setShareCode] = useState(code);
  const formCodeRef = useRef<HTMLInputElement>(null);

  const { mutate: generateCodeMutation } =
    api.words.generateShareCode.useMutation({
      onSuccess(res) {
        setShareCode(res.shareCode);
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
        placeholder={t("form.code.generate")}
        onClick={e => e.currentTarget.select()}
        className="mr-2 max-w-[18ch] border-r-[1px] border-r-[#adb2b8] bg-transparent pr-2 outline-0"
      />
      <Button onClick={clickHandler} className="[&>svg]:fill-primary">
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
