import * as Yup from "yup";
import clsx from "clsx";
import { type Dispatch, type SetStateAction } from "react";
import {
  Formik,
  FieldArray,
  type FormikErrors,
  Form as FormikForm,
} from "formik";
import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import { type Category, type Word } from "~/utils/placeholder";
import FormCategory from "~/components/Form/FormCategory";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";
import wordWithId from "~/utils/wordWithId";

type FormProps = {
  setIsFormOpen?: Dispatch<SetStateAction<boolean>>;
  initialValues: Word;
  submitHandler: (word: Word) => void;
};

const FormSchema = Yup.object({
  name: Yup.string().required(),
  transcription: Yup.string(),
  categories: Yup.array()
    .min(1, "At least one category should be present")
    .of(
      Yup.object({
        name: Yup.string().required("Category name is required"),
        meanings: Yup.array()
          .min(1)
          .of(
            Yup.object().shape({
              definition: Yup.string().required(),
              example: Yup.string(),
            }),
          ),
      }),
    ),
});

export default function Form({
  initialValues,
  setIsFormOpen,
  submitHandler,
}: FormProps) {
  const formSubmitHandler = (values: Word) => submitHandler(wordWithId(values));

  return (
    <Formik
      validationSchema={FormSchema}
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

        function handleFormNavigationBtns() {
          resetForm();
          setErrors({});
          setTouched({});
          if (setIsFormOpen) setIsFormOpen(false);
        }

        return (
          <FormikForm className="px-2 py-4 pb-6 [&>div]:mb-4">
            <div className="flex flex-wrap gap-4 [&>label>span]:text-center [&>label]:grid [&>label]:grow">
              <Input
                id="name"
                placeholder="Enter Name"
                className={clsx(
                  errors.name && touched.name && "border-2 border-red-500",
                )}
              >
                <span>Name</span>
              </Input>

              <Input id="transcription" placeholder="Enter Transcription">
                <span>Transcription</span>
              </Input>
            </div>
            <FieldArray name="categories">
              {(arrayHelpers: FieldArrayHelpers) => (
                <div>
                  <h2 className="text-center">Categories</h2>
                  {values.categories.map((category, cIndex) => (
                    <FormCategory
                      key={cIndex}
                      categoryErrors={errorCategories}
                      categoryTouched={touched.categories}
                      category={category}
                      categoryIndex={cIndex}
                      push={arrayHelpers.push}
                      remove={arrayHelpers.remove}
                      categoriesLength={values.categories.length}
                    />
                  ))}
                </div>
              )}
            </FieldArray>
            <div className="flex gap-4 [&>button:first-child]:flex-grow-[5] [&>button:last-child]:flex-grow [&>button]:px-4 [&>button]:py-2">
              <Button
                isSubmit={true}
                onClick={() => {
                  if (isValid) setTimeout(handleFormNavigationBtns, 500);
                }}
                className="rounded-md bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:bg-opacity-50 dark:bg-gray-900 dark:disabled:bg-opacity-50"
              >
                Add Word
              </Button>
              <Button
                onClick={handleFormNavigationBtns}
                className="rounded-md bg-gray-300 dark:bg-gray-900"
              >
                Cancel
              </Button>
            </div>
          </FormikForm>
        );
      }}
    </Formik>
  );
}
