import { useTranslation } from "next-i18next";
import React, { forwardRef, type MutableRefObject } from "react";

import Button from "~/components/Button/Button";
import useSessionData from "~/store/useSessionData";
import { useWordCode } from "~/features/word-add";

type FormCodeShareProps = {
  closeHandler: () => void;
};

const FormImportWord = forwardRef<HTMLInputElement, FormCodeShareProps>(
  function FormImportWord({ closeHandler }, ref) {
    const { t } = useTranslation();
    const isAuthed = useSessionData(state => state.isAuthed);

    const importFromCode = useWordCode(closeHandler);

    function shareCodeFormHandler(e: React.FormEvent) {
      e.preventDefault();

      const assertedRef = ref as MutableRefObject<HTMLInputElement>;
      if (isAuthed && assertedRef.current)
        importFromCode({ code: assertedRef.current.value });
    }

    return (
      <form onSubmit={shareCodeFormHandler} className="grid gap-2 px-4 py-1">
        <input
          ref={ref}
          className="rounded-md bg-gray-300 px-4 py-2 placeholder-[#757575] outline-1 outline-offset-2 outline-primary focus-visible:outline dark:bg-gray-900"
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

export default FormImportWord;
