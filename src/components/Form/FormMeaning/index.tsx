import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import { type Meaning } from "~/types/ApiTypes";
import { type FormikErrors, type FormikTouched } from "formik";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

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
      className="grid grid-cols-[1fr,_1fr,_auto] gap-4 mobile:grid-cols-none"
      key={`meaning.${meaningIndex}`}
    >
      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.definition`}
        placeholder={t("form.word.category.meaning.definition")}
        value={meaning.definition}
        className={clsx(hasErrorBorder && "border-2 border-red-500", "w-full")}
      />

      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.example`}
        placeholder={t("form.word.category.meaning.example")}
        value={meaning.example || ""}
        className="w-full"
      />
      <Button
        onClick={() => removeMeaning(meaningIndex)}
        className="group/button rounded-md bg-primary bg-opacity-30 px-4 hover:bg-red-500 dark:bg-gray-900 dark:hover:bg-red-500 mobile:py-2"
      >
        <span className="sr-only">
          {t("form.word.category.meaning.remove")}
        </span>
        <span className="group-hover/button:text-white" aria-hidden={true}>
          X
        </span>
      </Button>
    </div>
  );
}
