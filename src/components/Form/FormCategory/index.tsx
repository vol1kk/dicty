import Input from "~/components/Input/Input";
import { FieldArray } from "formik";
import Button from "~/components/Button/Button";
import FormMeaning from "~/components/Form/FormMeaning";
import useUserPreferences from "~/store/useUserPreferences";
import clsx from "clsx";
import DotsIcon from "~/components/Icons/DotsIcon";
import { useRef, useState } from "react";
import { type Push } from "~/types/Push";
import { type Meaning } from "~/utils/placeholder";

const categoryTemplate = {
  name: "",
  meanings: [{ definition: "", example: "" }],
};

type FormCategoryProps = {
  index: number;
  totalCategories: number;
  category: {
    name: string;
    meanings: Omit<Meaning, "id">[];
  };
  pushCategory: (data: typeof categoryTemplate) => void;
  removeCategory: (index: number) => void;
};

const meaningTemplate = {
  definition: "",
  example: "",
};

export default function FormCategory({
  category,
  totalCategories,
  pushCategory,
  removeCategory,
  index,
}: FormCategoryProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";
  const [isExpanded, setIsExpanded] = useState(false);
  const pushMeaningRef = useRef<(data: typeof meaningTemplate) => void>();

  return (
    <div role="list" className="mb-8 [&>*]:mb-4" key={`categories.${index}`}>
      <Input
        id={`categories.${index}.name`}
        before={false}
        className="w-full "
        classNameLabel="relative block col-span-2"
        value={category.name}
        placeholder="Enter Category"
        isDarkTheme={isDarkTheme}
      >
        <Button
          onClick={() => setIsExpanded(p => !p)}
          className={clsx(
            isDarkTheme ? "bg-gray-800" : "bg-primary bg-opacity-30",
            "absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-2",
          )}
        >
          <DotsIcon
            dimensions={16}
            className={clsx(isDarkTheme ? "fill-white" : "fill-primary")}
          />
        </Button>
        {isExpanded && (
          <div
            onClick={e => e.preventDefault()}
            className={clsx(
              isDarkTheme ? "bg-gray-900" : "bg-white",
              "absolute right-0 top-10 z-10 rounded-md p-4 shadow-2xl",
            )}
          >
            <ul className="[&>li]:cursor-pointer [&>li]:p-2">
              <li
                onClick={() =>
                  pushMeaningRef.current &&
                  pushMeaningRef.current(meaningTemplate)
                }
              >
                Add Meaning
              </li>
              <li onClick={() => pushCategory(categoryTemplate)}>
                Add Category
              </li>
              <li onClick={() => removeCategory(index)}>Remove Category</li>
            </ul>
          </div>
        )}
      </Input>

      <FieldArray name={`categories.${index}.meanings`}>
        {({
          push: pushMeaning,
          remove: removeMeaning,
        }: Push<typeof meaningTemplate> & {
          remove: (index: number) => void;
        }) => {
          pushMeaningRef.current = pushMeaning;

          const removeMeaningHandler = (i: number) => {
            if (category.meanings.length !== 1) removeMeaning(i);

            if (category.meanings.length === 1 && totalCategories > 1)
              removeCategory(index);
          };

          return (
            <>
              {category.meanings.map((meaning, mIndex) => (
                <FormMeaning
                  key={mIndex}
                  meaning={meaning}
                  removeMeaning={removeMeaningHandler}
                  meaningIndex={mIndex}
                  categoryIndex={index}
                />
              ))}
            </>
          );
        }}
      </FieldArray>
    </div>
  );
}
