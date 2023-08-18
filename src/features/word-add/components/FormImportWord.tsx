import { useTranslation } from "next-i18next";
import React, { forwardRef, type MutableRefObject, type Ref } from "react";

import { useToasts } from "~/features/toast";
import Button from "~/components/Button/Button";
import useSessionData from "~/store/useSessionData";
import { useImportFromCode } from "~/features/word-add";

export type FormCodeShareProps = {
  ref: Ref<HTMLInputElement>;
  closeHandler: () => void;
};

const FormImportWord = forwardRef<HTMLInputElement, FormCodeShareProps>(
  function FormImportWord({ closeHandler }, ref) {
    const { addToast } = useToasts();
    const { t } = useTranslation();
    const isAuthed = useSessionData(state => state.isAuthed);

    const importFromCode = useImportFromCode({
      onSuccess() {
        setTimeout(closeHandler, 500);
        addToast({
          text: t("toast.import.success", { count: 1 }),
        });
      },

      onError(e: string) {
        addToast({
          type: "error",
          autoClose: false,
          text: t("toast.import.error", { count: 0, error: e }),
        });
      },
    });

    function shareCodeFormHandler(e: React.FormEvent) {
      e.preventDefault();

      const assertedRef = ref as MutableRefObject<HTMLInputElement>;
      if (isAuthed && assertedRef.current)
        importFromCode({ code: assertedRef.current.value });
    }

    return (
      <form
        data-testid="form-import-from-code"
        onSubmit={shareCodeFormHandler}
        className="grid gap-2 px-4 py-4"
      >
        <input
          ref={ref}
          type="text"
          data-testid="input-import-from-code"
          className="rounded-md bg-gray-300 px-4 py-2 placeholder-[#757575] outline-1 outline-offset-2 outline-primary focus-visible:outline dark:bg-gray-900"
          placeholder={t("form.code.import.placeholder")}
        />
        <Button
          data-testid="button-import-from-code"
          className="rounded-md bg-gray-300 p-2 !outline-1 dark:bg-gray-900"
          isSubmit={true}
        >
          {t("form.code.import")}
        </Button>
      </form>
    );
  },
);

export default FormImportWord;
