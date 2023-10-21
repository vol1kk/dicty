import { useTranslation } from "next-i18next";
import { type FormikErrors, type FormikTouched } from "formik";

import cn from "~/utils/cn";
import Input from "~/components/Input";
import { Button } from "~/components/Button";
import { type Meaning } from "~/types/ApiTypes";
import { CloseIcon } from "~/components/Icons";

type FormMeaningProps = {
  meaningIndex: number;
  categoryIndex: number;
  meaning: Meaning;
  removeMeaning: (index: number) => void;
  meaningsErrors: FormikErrors<Meaning[]> | undefined;
  meaningsTouched: FormikTouched<Meaning[]> | undefined;
};

export default function FormMeaning({
  meaning,
  meaningIndex,
  removeMeaning,
  categoryIndex,
  meaningsErrors,
  meaningsTouched,
}: FormMeaningProps) {
  const { t } = useTranslation();
  const currentMeaningError = meaningsErrors?.at(meaningIndex);
  const currentMeaningTouched = meaningsTouched?.at(meaningIndex);
  const hasErrorBorder = currentMeaningError && currentMeaningTouched;

  return (
    <div
      className="grid grid-cols-[1fr,_1fr,_auto] gap-2 mobile:grid-cols-none"
      key={`meaning.${meaningIndex}`}
    >
      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.definition`}
        placeholder={t("input.meaning.placeholder")}
        value={meaning.definition}
        className={cn(
          hasErrorBorder && "outline-offset-4 ring-2 ring-red-500",
          "w-full",
        )}
      />

      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.example`}
        placeholder={t("input.meaning.example.placeholder")}
        value={meaning.example || ""}
        className="w-full"
      />
      <Button
        aria-label={t("form.word.category.meaning.remove")}
        onClick={() => removeMeaning(meaningIndex)}
        className="group rounded-md bg-primary bg-opacity-30 px-4 transition-colors hover:bg-red-500 dark:bg-gray-900 dark:hover:bg-red-500 mobile:py-2"
      >
        <CloseIcon
          aria-hidden={true}
          width={16}
          className="mx-auto fill-black group-hover:fill-white dark:fill-white"
        />
      </Button>
    </div>
  );
}
