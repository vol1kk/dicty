import Input from "~/components/Input/Input";
import useUserPreferences from "~/store/useUserPreferences";

type FormMeaningProps = {
  meaningIndex: number;
  categoryIndex: number;
  meaning: {
    definition: string;
    example: string;
  };
};

export default function FormMeaning({
  meaning,
  meaningIndex,
  categoryIndex,
}: FormMeaningProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  return (
    <div
      className="mb-2 grid grid-cols-2 gap-4"
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
    </div>
  );
}
