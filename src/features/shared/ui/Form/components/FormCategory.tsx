import { useRef } from "react";
import { useTranslation } from "next-i18next";
import { FieldArray, type FormikErrors, type FormikTouched } from "formik";

import cn from "~/utils/cn";
import Input from "~/components/Input";
import { type Category, type Meaning } from "~/types/ApiTypes";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";
import {
  CategoryOptions,
  categoryTemplate,
  FormMeaning,
  meaningTemplate,
} from "~/features/shared/ui/Form";

type FormCategoryProps = {
  categoryIndex: number;
  categoriesLength: number;
  category: Category;
  categoryErrors: FormikErrors<Category[]> | undefined;
  categoryTouched: FormikTouched<Category[]> | undefined;
} & Pick<FieldArrayHelpers, "push" | "remove" | "move">;

export default function FormCategory({
  category,
  categoryIndex,
  categoryErrors,
  categoryTouched,
  categoriesLength,
  move: moveCategory,
  push: pushCategory,
  remove: removeCategory,
}: FormCategoryProps) {
  const { t } = useTranslation();

  const meaningsHelpersRef = useRef(
    {} as Pick<FieldArrayHelpers, "push" | "remove">,
  );

  function removeCategoryHandler(i: number) {
    if (categoriesLength > 1) removeCategory(i);
  }

  function removeMeaningHandler(i: number) {
    if (category.meanings.length !== 1) meaningsHelpersRef.current.remove(i);

    if (category.meanings.length === 1 && categoriesLength > 1)
      removeCategoryHandler(categoryIndex);
  }

  function categoryCallback(data: HTMLLIElement) {
    const action = data.dataset.action ?? "Add Meaning";

    if (action === "add-category") pushCategory(categoryTemplate);
    if (action === "remove-category") removeCategoryHandler(categoryIndex);
    if (action === "move-down") moveCategory(categoryIndex, categoryIndex + 1);
    if (action === "move-up") moveCategory(categoryIndex, categoryIndex - 1);

    if (action === "add-meaning")
      meaningsHelpersRef.current?.push(meaningTemplate);

    data.ariaSelected = "false";
    (data.parentElement?.firstElementChild as HTMLLIElement).ariaSelected =
      "true";
  }

  const currentCategoryErrors = categoryErrors?.at(categoryIndex);
  const currentCategoryTouched = categoryTouched?.at(categoryIndex);
  const hasErrorBorder =
    currentCategoryErrors?.name && currentCategoryTouched?.name;

  const currentCategoryMeaningsErrors = currentCategoryErrors?.meanings as
    | FormikErrors<Meaning[]>
    | undefined;

  return (
    <div role="list" className="[&>*]:mb-4" key={`categories.${categoryIndex}`}>
      <div>
        <Input
          id={`categories.${categoryIndex}.name`}
          before={false}
          className="w-full outline-0"
          classNameLabel={cn(
            hasErrorBorder && "outline-offset-4 ring-2 ring-red-500",
            "flex col-span-2 dark:bg-gray-900 bg-gray-300 rounded-md focus-within:outline outline-1 outline-primary outline-offset-4",
          )}
          value={category.name}
          placeholder={t("form.word.category.placeholder")}
        >
          <CategoryOptions
            callback={categoryCallback}
            currentCategory={categoryIndex}
            categoriesLength={categoriesLength}
          />
        </Input>
      </div>
      <FieldArray name={`categories.${categoryIndex}.meanings`}>
        {(meaningsHelpers: FieldArrayHelpers) => {
          meaningsHelpersRef.current.push = meaningsHelpers.push;
          meaningsHelpersRef.current.remove = meaningsHelpers.remove;

          return (
            <>
              {category.meanings.map((meaning, meaningIndex) => (
                <FormMeaning
                  meaning={meaning}
                  key={meaningIndex}
                  meaningIndex={meaningIndex}
                  categoryIndex={categoryIndex}
                  removeMeaning={removeMeaningHandler}
                  meaningsErrors={currentCategoryMeaningsErrors}
                  meaningsTouched={currentCategoryTouched?.meanings}
                />
              ))}
            </>
          );
        }}
      </FieldArray>
    </div>
  );
}
