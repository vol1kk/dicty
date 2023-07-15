import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import { type MeaningWithoutId } from "~/utils/placeholder";
import { type FormikErrors, type FormikTouched } from "formik";
import clsx from "clsx";

type FormMeaningProps = {
  meaningIndex: number;
  categoryIndex: number;
  meaning: MeaningWithoutId;
  removeMeaning: (index: number) => void;
  meaningsErrors: FormikErrors<MeaningWithoutId[]> | undefined;
  meaningsTouched: FormikTouched<MeaningWithoutId[]> | undefined;
};

export default function FormMeaning({
  meaning,
  meaningIndex,
  removeMeaning,
  categoryIndex,
  meaningsErrors,
  meaningsTouched,
}: FormMeaningProps) {
  const currentMeaningError = meaningsErrors?.at(meaningIndex);
  const currentMeaningTouched = meaningsTouched?.at(meaningIndex);

  return (
    <div
      className="grid grid-cols-[1fr,_1fr,_auto] gap-4"
      key={`meaning.${meaningIndex}`}
    >
      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.definition`}
        className={clsx(
          currentMeaningError?.definition &&
            currentMeaningTouched?.definition &&
            "border-2 border-red-500",
          "w-full",
        )}
        value={meaning.definition}
        placeholder="Enter Definition"
      />

      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.example`}
        className="w-full"
        value={meaning.example}
        placeholder="Enter Example"
      />
      <Button
        onClick={() => removeMeaning(meaningIndex)}
        className="rounded-md bg-primary bg-opacity-30 px-4 hover:bg-red-500 dark:bg-gray-900 dark:hover:bg-red-500"
      >
        <span className="sr-only">Delete definition</span>
        <span aria-hidden={true}>X</span>
      </Button>
    </div>
  );
}
