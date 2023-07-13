import clsx from "clsx";
import { FieldArray } from "formik";
import { useRef, useState } from "react";
import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import DotsIcon from "~/components/Icons/DotsIcon";
import FormMeaning from "~/components/Form/FormMeaning";
import useUserPreferences from "~/store/useUserPreferences";
import {
  type CategoryWithoutId,
  type MeaningWithoutId,
} from "~/utils/placeholder";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";

type FormCategoryProps = {
  categoryIndex: number;
  categoriesLength: number;
  category: CategoryWithoutId;
} & Pick<FieldArrayHelpers, "push" | "remove">;

const meaningTemplate = {
  definition: "",
  example: "",
};

const categoryTemplate = {
  name: "",
  meanings: [meaningTemplate],
};

export default function FormCategory({
  categoryIndex,
  category,
  categoriesLength,
  push: pushCategory,
  remove: removeCategory,
}: FormCategoryProps) {
  const pushMeaningRef = useRef(
    {} as Pick<FieldArrayHelpers, "push" | "remove">,
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  function removeCategoryHandler(i: number) {
    if (categoriesLength > 1) removeCategory(i);
  }
  function removeMeaningHandler(i: number) {
    if (category.meanings.length !== 1) pushMeaningRef.current.remove(i);

    if (category.meanings.length === 1 && categoriesLength > 1)
      removeCategoryHandler(categoryIndex);
  }

  return (
    <div
      role="list"
      className="mb-8 [&>*]:mb-4"
      key={`categories.${categoryIndex}`}
    >
      <Input
        id={`categories.${categoryIndex}.name`}
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
              <li onClick={() => pushMeaningRef.current?.push(meaningTemplate)}>
                Add Meaning
              </li>
              <li onClick={() => pushCategory(categoryTemplate)}>
                Add Category
              </li>
              <li onClick={() => removeCategoryHandler(categoryIndex)}>
                Remove Category
              </li>
            </ul>
          </div>
        )}
      </Input>

      <FieldArray name={`categories.${categoryIndex}.meanings`}>
        {(arrayHelpers: FieldArrayHelpers) => {
          pushMeaningRef.current.push = arrayHelpers.push;
          pushMeaningRef.current.remove = arrayHelpers.remove;

          return (
            <>
              {category.meanings.map((meaning, meaningIndex) => (
                <FormMeaning
                  meaning={meaning}
                  key={meaningIndex}
                  meaningIndex={meaningIndex}
                  categoryIndex={categoryIndex}
                  removeMeaning={removeMeaningHandler}
                />
              ))}
            </>
          );
        }}
      </FieldArray>
    </div>
  );
}
