import { useTranslation } from "next-i18next";
import React, { forwardRef, type MutableRefObject, type Ref } from "react";

import { useToasts } from "~/features/toast";
import { Button } from "~/components/Button";
import useSessionData from "~/store/useSessionData";
import { useImportFromCode } from "~/features/word-add";
import { ImportIcon } from "~/components/Icons";

export type FormCodeShareProps = {
  ref: Ref<HTMLInputElement>;
  closeHandler: () => void;
};

const FormImportWord = forwardRef<HTMLInputElement, FormCodeShareProps>(
  function FormImportWord({ closeHandler }, ref) {
    const { toast } = useToasts();
    const { t } = useTranslation();
    const isAuthed = useSessionData(state => state.isAuthed);

    const importFromCode = useImportFromCode({
      onSuccess() {
        setTimeout(closeHandler, 500);
        toast.success({
          text: t("toast.import.success", { count: 1 }),
        });
      },

      onError(e: string) {
        toast.error({
          text: t("toast.import.error", { count: 1, error: e }),
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
          id="code"
          name="code"
          type="text"
          data-testid="input-import-from-code"
          className="w-full rounded-md bg-gray-300 px-4 py-2 placeholder-[#757575] outline-1 outline-offset-2 outline-primary focus-visible:outline dark:bg-gray-900"
          placeholder={t("input.import.placeholder")}
        />
        <Button
          data-testid="button-import-from-code"
          className="group flex items-center justify-center overflow-hidden rounded-md bg-gray-300 p-2 outline-1 dark:bg-gray-900 [&>*]:transition-[opacity,_transform]"
          isSubmit={true}
        >
          <ImportIcon
            width={18}
            className="-mt-1 translate-y-full fill-primary opacity-0 group-hover:translate-y-0  group-hover:opacity-100"
          />
          <span className="group-hover:translate-x-[10px]">
            {t("input.import.placeholder")}
          </span>
        </Button>
      </form>
    );
  },
);

export default FormImportWord;
