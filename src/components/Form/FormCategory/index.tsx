import { useRef } from "react";
import { FieldArray } from "formik";
import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import DotsIcon from "~/components/Icons/DotsIcon";
import Dropdown from "~/components/Dropdown/Dropdown";
import FormMeaning from "~/components/Form/FormMeaning";
import { type CategoryWithoutId } from "~/utils/placeholder";
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

  function removeCategoryHandler(i: number) {
    if (categoriesLength > 1) removeCategory(i);
  }
  function removeMeaningHandler(i: number) {
    if (category.meanings.length !== 1) pushMeaningRef.current.remove(i);

    if (category.meanings.length === 1 && categoriesLength > 1)
      removeCategoryHandler(categoryIndex);
  }

  function categoryCallback(data: HTMLLIElement) {
    const action = data.dataset.action ?? "Add Meaning";

    if (action === "add-meaning") pushMeaningRef.current?.push(meaningTemplate);

    if (action === "add-category") pushCategory(categoryTemplate);

    if (action === "remove-category") removeCategoryHandler(categoryIndex);

    data.ariaSelected = "false";
    (data.parentElement?.firstElementChild as HTMLLIElement).ariaSelected =
      "true";
  }

  return (
    <div
      role="list"
      className="mb-8 [&>*]:mb-4"
      key={`categories.${categoryIndex}`}
    >
      <div>
        <Input
          id={`categories.${categoryIndex}.name`}
          before={false}
          className="w-full"
          classNameLabel="relative flex col-span-2 dark:bg-gray-900 bg-gray-300 rounded-md"
          value={category.name}
          placeholder="Enter Category"
        >
          <Dropdown
            tabIndex={-1}
            renderTitle={() => (
              <Button className="rounded-full bg-primary bg-opacity-30 p-2 dark:bg-gray-800">
                <span className="sr-only">Edit Category</span>
                <DotsIcon
                  aria-hidden={true}
                  dimensions={16}
                  className="fill-primary dark:fill-white"
                />
              </Button>
            )}
            renderContent={dropdownItemHandler => {
              return (
                <ul
                  onClick={e => e.preventDefault()}
                  className="absolute -top-5 right-0 min-w-[180px] rounded-md bg-white p-4 shadow-xl dark:bg-gray-900 [&>li]:cursor-pointer [&>li]:leading-10"
                >
                  {["Add Meaning", "Add Category", "Remove Category"].map(
                    (name, index) => (
                      <li
                        key={name}
                        role="option"
                        aria-selected={0 === index}
                        onClick={dropdownItemHandler}
                        data-action={name.toLowerCase().split(" ").join("-")}
                        className="outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary"
                      >
                        {name}
                      </li>
                    ),
                  )}
                </ul>
              );
            }}
            callback={categoryCallback}
          />
        </Input>
      </div>
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
