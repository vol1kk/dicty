import { type ReactElement } from "react";
import { useTranslation } from "next-i18next";
import {
  Formik,
  FieldArray,
  type FormikErrors,
  type ArrayHelpers,
  Form as FormikForm,
} from "formik";

import cn from "~/utils/cn";
import Input from "~/components/Input";
import { type Category, type Word } from "~/types/ApiTypes";
import {
  FormTitle,
  prepareWord,
  FormCategory,
  formTemplate,
  formValidationSchema,
} from "~/features/shared/ui/Form";

type FormProps = {
  initialValues?: Word;
  submitHandler: (word: Word) => void;
  classNameButtons?: string;
  renderButtons: (
    isValid: boolean,
    handleFormReset: () => void,
  ) => ReactElement;
};

export default function Form({
  renderButtons,
  submitHandler,
  classNameButtons,
  initialValues = formTemplate,
}: FormProps) {
  const { t } = useTranslation();

  return (
    <Formik
      validateOnMount={true}
      enableReinitialize={true}
      validationSchema={formValidationSchema}
      onSubmit={values =>
        submitHandler(prepareWord({ data: values, transformFor: "api" }))
      }
      initialValues={prepareWord({
        data: initialValues,
        transformFor: "form",
      })}
    >
      {formHelpers => {
        const {
          values,
          errors,
          touched,
          isValid,
          setErrors,
          resetForm,
          setTouched,
        } = formHelpers;

        const errorCategories = errors.categories as
          | FormikErrors<Category[]>
          | undefined;

        function handleFormReset() {
          resetForm();
          setErrors({});
          void setTouched({});
        }

        const formButtons = renderButtons(isValid, handleFormReset);

        return (
          <FormikForm
            data-testid="word-form"
            className="rounded-md bg-gray-100 p-4 dark:bg-gray-800 [&>div]:mb-4"
          >
            <div>
              <div className="mb-4 flex flex-wrap gap-4 [&>label>span]:text-center [&>label]:grid [&>label]:grow">
                <Input
                  id="name"
                  placeholder={t("input.name.placeholder")}
                  className={cn(
                    errors.name &&
                      touched.name &&
                      "outline-offset-4 ring-2 ring-red-500",
                    "w-full",
                  )}
                />
                <Input
                  id="transcription"
                  className="w-full"
                  placeholder={t("input.transcription.placeholder")}
                />
              </div>
              <div className="flex flex-wrap gap-4 [&>label]:grow">
                <Input
                  id="dictionary"
                  className="w-full"
                  placeholder={t("input.dict.placeholder")}
                />
                <Input
                  id="language"
                  className="w-full"
                  placeholder={t("input.lang.placeholder")}
                />
              </div>
            </div>
            <FieldArray name="categories">
              {(ctgHelpers: ArrayHelpers) => (
                <div>
                  <FormTitle
                    text={t("category", { count: 0 })}
                    className="mb-2"
                  />
                  {values.categories.map((category, cIndex) => (
                    <FormCategory
                      key={cIndex}
                      category={category}
                      categoryIndex={cIndex}
                      categoryErrors={errorCategories}
                      categoryTouched={touched.categories}
                      push={value => ctgHelpers.push(value)}
                      remove={ind => ctgHelpers.remove(ind)}
                      categoriesLength={values.categories.length}
                      move={(from, to) => ctgHelpers.move(from, to)}
                    />
                  ))}
                </div>
              )}
            </FieldArray>
            <div>
              <FormTitle text={t("related")} className="mb-2" />
              <Input
                id="synonyms"
                className="mb-4 w-full"
                placeholder={t("input.synonyms.placeholder")}
              />
              <Input
                id="antonyms"
                className="w-full"
                placeholder={t("input.antonyms.placeholder")}
              />
            </div>
            <div
              className={cn(
                classNameButtons,
                "[&_button]:px-4 [&_button]:py-2 [&_button]:transition-colors",
              )}
            >
              {formButtons}
            </div>
          </FormikForm>
        );
      }}
    </Formik>
  );
}
