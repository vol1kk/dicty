import clsx from "clsx";
import { type ReactElement } from "react";
import {
  Formik,
  FieldArray,
  type FormikErrors,
  Form as FormikForm,
} from "formik";
import { useTranslation } from "next-i18next";

import Input from "~/components/Input";
import { type Category, type Word } from "~/types/ApiTypes";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";
import FormCategory from "~/features/shared/ui/Form/components/FormCategory";
import { formTemplate, formValidationSchema } from "~/features/shared/ui/Form";

type FormProps = {
  initialValues?: Word;
  submitHandler: (word: Word) => void;
  renderButtons: (
    isValid: boolean,
    handleFormReset: () => void,
  ) => ReactElement;
};

export default function FormWord({
  renderButtons,
  submitHandler,
  initialValues = formTemplate,
}: FormProps) {
  const { t } = useTranslation();
  const formSubmitHandler = (values: Word) => {
    const transformedSynonyms = (values.synonyms as unknown as string)
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "");

    submitHandler({ ...values, synonyms: transformedSynonyms });
  };

  return (
    <Formik
      validationSchema={formValidationSchema}
      initialValues={initialValues}
      validateOnMount={true}
      onSubmit={formSubmitHandler}
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
          setTouched({});
        }

        const formButtons = renderButtons(isValid, handleFormReset);

        return (
          <FormikForm
            data-testid="word-form"
            className="rounded-md bg-gray-100 p-4 dark:bg-gray-800 [&>div]:mb-4"
          >
            <div>
              <div className="flex flex-wrap gap-4 [&>label>span]:text-center [&>label]:grid [&>label]:grow">
                <Input
                  id="name"
                  placeholder={t("form.word.name.placeholder")}
                  className={clsx(
                    errors.name && touched.name && "border-2 border-red-500",
                  )}
                >
                  <span>{t("form.word.name")}</span>
                </Input>

                <Input
                  id="transcription"
                  placeholder={t("form.word.transcription.placeholder")}
                >
                  <span>{t("form.word.transcription")}</span>
                </Input>
              </div>
              <Input
                id="synonyms"
                placeholder="Synonyms"
                className="mt-2 w-full"
              />
            </div>
            <FieldArray name="categories">
              {(arrayHelpers: FieldArrayHelpers) => (
                <div>
                  <h2 className="text-center">
                    {t("form.word.categories.label")}
                  </h2>
                  {values.categories.map((category, cIndex) => (
                    <FormCategory
                      key={cIndex}
                      category={category}
                      categoryIndex={cIndex}
                      push={arrayHelpers.push}
                      remove={arrayHelpers.remove}
                      categoryErrors={errorCategories}
                      categoryTouched={touched.categories}
                      categoriesLength={values.categories.length}
                    />
                  ))}
                </div>
              )}
            </FieldArray>
            <div className="flex flex-wrap gap-4 [&>button:first-child]:flex-grow-[6] [&>button:nth-child(2)]:flex-grow-[2] [&>button]:flex-grow [&>button]:rounded-md [&>button]:bg-gray-300 [&>button]:px-4 [&>button]:py-2 [&>button]:dark:bg-gray-900">
              {formButtons}
            </div>
          </FormikForm>
        );
      }}
    </Formik>
  );
}
