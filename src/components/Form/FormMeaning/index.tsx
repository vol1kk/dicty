import clsx from "clsx";
import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import { type MeaningWithoutId } from "~/utils/placeholder";
import useUserPreferences from "~/store/useUserPreferences";

type FormMeaningProps = {
  meaningIndex: number;
  categoryIndex: number;
  meaning: MeaningWithoutId;
  removeMeaning: (index: number) => void;
};

export default function FormMeaning({
  meaning,
  meaningIndex,
  removeMeaning,
  categoryIndex,
}: FormMeaningProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  return (
    <div
      className="grid grid-cols-[1fr,_1fr,_auto] gap-4"
      key={`meaning.${meaningIndex}`}
    >
      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.definition`}
        className="w-full"
        value={meaning.definition}
        placeholder="Enter Definition"
        isDarkTheme={isDarkTheme}
      />

      <Input
        role="option"
        id={`categories.${categoryIndex}.meanings.${meaningIndex}.example`}
        className="w-full"
        value={meaning.example}
        placeholder="Enter Example"
        isDarkTheme={isDarkTheme}
      />
      <Button
        onClick={() => removeMeaning(meaningIndex)}
        className={clsx(
          isDarkTheme ? "bg-gray-900" : "bg-primary bg-opacity-30",
          "rounded-md px-4 hover:bg-red-500",
        )}
      >
        <span className="sr-only">Delete definition</span>
        <span aria-hidden={true}>X</span>
      </Button>
    </div>
  );
}
