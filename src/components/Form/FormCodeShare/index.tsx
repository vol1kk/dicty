import Button from "~/components/Button/Button";
import { api } from "~/utils/api";
import { forwardRef, type MutableRefObject } from "react";
import { useTranslation } from "next-i18next";

type FormCodeShareProps = {
  closeHandler: () => void;
};

export default forwardRef<HTMLInputElement, FormCodeShareProps>(
  function FormCodeShare({ closeHandler }, ref) {
    const { t } = useTranslation();
    const utils = api.useContext();

    const { mutate: importFromCode } = api.words.importFromCode.useMutation({
      onSuccess() {
        utils.words.invalidate().catch(console.error);
        setTimeout(closeHandler, 500);
      },
    });

    function shareCodeFormHandler(e: React.FormEvent) {
      e.preventDefault();
      if (!ref) return;
      const assertedRef = ref as MutableRefObject<HTMLInputElement>;
      if (assertedRef.current)
        importFromCode({ code: assertedRef.current.value });
    }

    return (
      <form onSubmit={shareCodeFormHandler} className="grid gap-2 px-4 py-1">
        <input
          ref={ref}
          className="rounded-md bg-gray-300 px-4 py-2 outline-1 outline-offset-2 outline-primary focus-visible:outline dark:bg-gray-900"
          placeholder={t("form.code.import.placeholder")}
          type="text"
        />
        <Button
          className="rounded-md bg-gray-300 p-2 !outline-1 dark:bg-gray-900"
          isSubmit={true}
        >
          {t("form.code.import")}
        </Button>
      </form>
    );
  },
);
