import { type ReactElement } from "react";
import {
  Formik,
  FieldArray,
  type FormikErrors,
  Form as FormikForm,
  type ArrayHelpers,
} from "formik";
import { useTranslation } from "next-i18next";

import cn from "~/utils/cn";
import Input from "~/components/Input";
import { type Category, type Word } from "~/types/ApiTypes";
import FormCategory from "~/features/shared/ui/Form/components/FormCategory";
import { formTemplate, formValidationSchema } from "~/features/shared/ui/Form";

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
  const formSubmitHandler = (
    values: Omit<Word, "synonyms"> & { synonyms: string },
  ) => {
    const transformedSynonyms = values.synonyms
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "");

    submitHandler({
      ...values,
      synonyms: transformedSynonyms,
      language: values.language || null,
      dictionary: values.dictionary || null,
    });
  };

  const modifiedInitialValues = {
    ...initialValues,
    language: initialValues?.language || "",
    dictionary: initialValues?.dictionary || "",
    synonyms: initialValues?.synonyms.join(", "),
  };
  return (
    <Formik
      validateOnMount={true}
      enableReinitialize={true}
      onSubmit={formSubmitHandler}
      initialValues={modifiedInitialValues}
      validationSchema={formValidationSchema}
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
                  placeholder={t("form.word.name.placeholder")}
                  className={cn(
                    errors.name &&
                      touched.name &&
                      "outline-offset-4 ring-2 ring-red-500",
                    "w-full",
                  )}
                >
                  <span>{t("form.word.name")}</span>
                </Input>

                <Input
                  id="transcription"
                  className="w-full"
                  placeholder={t("form.word.transcription.placeholder")}
                >
                  <span>{t("form.word.transcription")}</span>
                </Input>
              </div>
              <div className="flex flex-wrap gap-4 [&>label]:grow">
                <Input
                  id="dictionary"
                  className="w-full"
                  placeholder={t("words.sort.by_dict.default", { count: 1 })}
                />
                <Input
                  id="language"
                  className="w-full"
                  placeholder={t("words.sort.by_lang.default", { count: 1 })}
                />
              </div>
            </div>
            <FieldArray name="categories">
              {(ctgHelpers: ArrayHelpers) => (
                <div>
                  <h2 className="mb-1 text-center">
                    {t("form.word.categories.label")}
                  </h2>
                  {values.categories.map((category, cIndex) => (
                    <FormCategory
                      key={cIndex}
                      category={category}
                      categoryIndex={cIndex}
                      remove={ind => ctgHelpers.remove(ind)}
                      push={value => ctgHelpers.push(value)}
                      move={(from, to) => ctgHelpers.move(from, to)}
                      categoryErrors={errorCategories}
                      categoryTouched={touched.categories}
                      categoriesLength={values.categories.length}
                    />
                  ))}
                </div>
              )}
            </FieldArray>
            <Input
              id="synonyms"
              className="mb-8 w-full"
              placeholder={t("form.word.synonyms")}
            />
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
