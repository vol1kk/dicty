import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import { useToasts } from "~/features/toast";
import { Button } from "~/components/Button";
import Accordion from "~/components/Accordion";
import { CloseIcon } from "~/components/Icons";
import useSessionData from "~/store/useSessionData";
import { useCreateWord } from "~/features/word-add";
import Form, { formTemplate } from "~/features/shared/ui/Form";
import FormImportWord from "~/features/word-add/components/FormImportWord";

export default function FormAddWord() {
  const { t } = useTranslation("common");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const isAuthed = useSessionData(state => state.isAuthed);

  const { addToast, removeToast } = useToasts();
  const inputCodeRef = useRef<HTMLInputElement>(null);

  function formCloseHandler() {
    if (inputCodeRef.current) inputCodeRef.current.value = "";
    setIsFormOpen(false);
  }

  let id: string;
  const createWord = useCreateWord({
    onSuccess() {
      id = nanoid();

      addToast({
        id,
        text: t("toast.createWord.success"),
      });
    },

    onError(e) {
      if (id) removeToast(id);

      addToast({
        type: "error",
        text: t("toast.createWord.error", { error: e }),
        autoClose: false,
      });
    },
  });

  return (
    <div
      data-testid="form-container"
      className=" mb-4 rounded-md bg-gray-100 dark:bg-gray-800"
    >
      <Button
        data-testid="form-open"
        aria-expanded={isFormOpen}
        onClick={() => setIsFormOpen(p => !p)}
        className="group/accordionTitle flex w-full items-center justify-center gap-4 rounded-md p-4 text-xl outline-offset-0"
      >
        {t("form.word.button.add")}
        <span className="rounded-full border-2 border-black p-1 group-aria-expanded/accordionTitle:border-primary dark:border-white dark:group-aria-expanded/accordionTitle:border-white">
          <CloseIcon className="h-4 w-4 -rotate-45 fill-black transition-transform group-aria-expanded/accordionTitle:rotate-0 group-aria-expanded/accordionTitle:fill-primary dark:fill-white" />
        </span>
      </Button>
      <Accordion strategy={{ isOpen: isFormOpen }}>
        {isAuthed && (
          <>
            <FormImportWord
              ref={inputCodeRef}
              closeHandler={formCloseHandler}
            />
            <div className="relative mx-2 flex select-none items-center justify-center">
              <div className="absolute h-1 w-full rounded-md bg-gray-300 dark:bg-gray-900" />
              <span className="text-bold relative z-[1] rounded-md bg-gray-300 px-6 py-1 text-sm font-bold uppercase dark:bg-gray-900">
                {t("form.or")}
              </span>
            </div>
          </>
        )}
        <Form
          initialValues={formTemplate}
          submitHandler={word => createWord(word)}
          renderButtons={(isValid, handleFormReset) => {
            function handleFormResetWrapper() {
              formCloseHandler();
              handleFormReset();
            }

            return (
              <>
                <Button
                  variant="darker"
                  isSubmit={true}
                  disabled={!isValid}
                  data-testid="button-word-create"
                  className="hover:bg-green-500 hover:text-white disabled:cursor-no-drop disabled:!bg-opacity-70 dark:hover:bg-green-600"
                  onClick={() => {
                    if (isValid) setTimeout(handleFormResetWrapper, 500);
                  }}
                >
                  {t("form.word.button.add")}
                </Button>
                <Button
                  variant="darker"
                  data-testid="button-form-close"
                  className="hover:bg-red-500 hover:text-white dark:hover:bg-red-500"
                  onClick={handleFormResetWrapper}
                >
                  {t("form.word.button.close")}
                </Button>
              </>
            );
          }}
        />
      </Accordion>
    </div>
  );
}
