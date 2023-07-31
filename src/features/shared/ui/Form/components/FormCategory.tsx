import clsx from "clsx";
import { useRef } from "react";
import { useTranslation } from "next-i18next";
import { FieldArray, type FormikErrors, type FormikTouched } from "formik";

import Input from "~/components/Input/Input";
import { type Category, type Meaning } from "~/types/ApiTypes";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";
import FormMeaning from "~/features/shared/ui/Form/components/FormMeaning";
import { categoryTemplate, meaningTemplate } from "~/features/shared/ui/Form";
import CategoryOptions from "~/features/shared/ui/Form/components/FormCategoryOptions";

type FormCategoryProps = {
  categoryIndex: number;
  categoriesLength: number;
  category: Category;
  categoryErrors: FormikErrors<Category[]> | undefined;
  categoryTouched: FormikTouched<Category[]> | undefined;
} & Pick<FieldArrayHelpers, "push" | "remove">;

export default function FormCategory({
  category,
  categoryIndex,
  categoryErrors,
  categoryTouched,
  categoriesLength,
  push: pushCategory,
  remove: removeCategory,
}: FormCategoryProps) {
  const { t } = useTranslation();

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

    if (action === "add-category") pushCategory(categoryTemplate);
    if (action === "remove-category") removeCategoryHandler(categoryIndex);
    if (action === "add-meaning") pushMeaningRef.current?.push(meaningTemplate);

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
    <div
      role="list"
      className="mb-8 [&>*]:mb-4"
      key={`categories.${categoryIndex}`}
    >
      <div>
        <Input
          id={`categories.${categoryIndex}.name`}
          before={false}
          className="w-full !outline-0"
          classNameLabel={clsx(
            hasErrorBorder && "border-2 border-red-500",
            "flex col-span-2 dark:bg-gray-900 bg-gray-300 rounded-md focus-within:outline outline-1 outline-primary outline-offset-2",
          )}
          value={category.name}
          placeholder={t("form.word.category.placeholder")}
        >
          <CategoryOptions callback={categoryCallback} />
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
