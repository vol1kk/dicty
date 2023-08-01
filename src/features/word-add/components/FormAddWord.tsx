import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import Accordion from "~/components/Accordion";
import Button from "~/components/Button/Button";
import FormWord from "~/features/shared/ui/Form";
import { useCreateWord } from "~/features/word-add";
import FormImportWord from "~/features/word-add/components/FormImportWord";

export default function FormAddWord() {
  const { t } = useTranslation("common");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputCodeRef = useRef<HTMLInputElement>(null);

  function formCloseHandler() {
    if (inputCodeRef.current) inputCodeRef.current.value = "";
    setIsFormOpen(false);
  }

  const createWord = useCreateWord();

  return (
    <div
      aria-expanded={isFormOpen}
      className="group/accordionTitle mb-4 rounded-md bg-gray-100 dark:bg-gray-800"
    >
      <Button
        className="flex w-full items-center justify-center gap-4 rounded-md p-4 text-xl !outline-offset-0"
        onClick={() => setIsFormOpen(p => !p)}
      >
        {t("form.word.button.add")}
        <span className="grid h-8 w-8 place-content-center rounded-full border-2 border-black text-2xl transition-transform group-aria-expanded/accordionTitle:rotate-45 group-aria-expanded/accordionTitle:border-primary  group-aria-expanded/accordionTitle:text-primary dark:border-white dark:group-aria-expanded/accordionTitle:border-white">
          +
        </span>
      </Button>
      <Accordion isOpen={isFormOpen}>
        <FormImportWord ref={inputCodeRef} closeHandler={formCloseHandler} />
        <FormWord
          submitHandler={word => createWord(word)}
          renderButtons={(isValid, handleFormReset) => {
            function handleFormResetWrapper() {
              formCloseHandler();
              handleFormReset();
            }

            return (
              <>
                <Button
                  isSubmit={true}
                  onClick={() => {
                    if (isValid) setTimeout(handleFormResetWrapper, 500);
                  }}
                >
                  {t("form.word.button.add")}
                </Button>
                <Button onClick={handleFormResetWrapper}>
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
