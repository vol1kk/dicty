import Input from "~/components/Input/Input";
import { FieldArray } from "formik";
import Button from "~/components/Button/Button";
import FormMeaning from "~/components/Form/FormMeaning";
import useUserPreferences from "~/store/useUserPreferences";
import { type Push } from "~/components/Form/Form";
import clsx from "clsx";

type FormCategoryProps = {
  category: {
    name: string;
    meanings: [
      {
        definition: string;
        example: string;
      },
    ];
  };
  index: number;
};

const meaningTemplate = {
  definition: "",
  example: "",
};

export default function FormCategory({ category, index }: FormCategoryProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  return (
    <div className="mb-4" key={`categories.${index}`}>
      <Input
        id={`categories.${index}.name`}
        className="mb-4 w-full"
        value={category.name}
        placeholder="Enter Category"
        isDarkTheme={isDarkTheme}
      />

      <FieldArray name={`categories.${index}.meanings`}>
        {({ push: pushMeaning }: Push<typeof meaningTemplate>) => (
          <div>
            <div role="list">
              {category.meanings.map((meaning, mIndex) => (
                <FormMeaning
                  key={mIndex}
                  meaning={meaning}
                  meaningIndex={mIndex}
                  categoryIndex={index}
                />
              ))}
            </div>
            <Button
              className={clsx(
                isDarkTheme ? "bg-gray-900" : "bg-gray-300",
                "m-2 mx-auto w-2/6 block rounded-md px-4 py-2",
              )}
              onClick={() => pushMeaning(meaningTemplate)}
            >
              Insert meaning
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
