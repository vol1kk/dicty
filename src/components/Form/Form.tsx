import clsx from "clsx";
import * as Yup from "yup";
import {
  Formik,
  FieldArray,
  type FormikErrors,
  Form as FormikForm,
} from "formik";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";
import { type Category, type Word } from "~/utils/placeholder";
import FormCategory from "~/components/Form/FormCategory";
import Input from "~/components/Input/Input";

type FormProps = {
  renderButtons: (
    isValid: boolean,
    handleFormReset: () => void,
  ) => React.ReactElement;
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
  renderButtons,
  initialValues,
  submitHandler,
}: FormProps) {
  const formSubmitHandler = (values: Word) => submitHandler(values);

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

        function handleFormReset() {
          resetForm();
          setErrors({});
          setTouched({});
        }

        const formButtons = renderButtons(isValid, handleFormReset);

        return (
          <FormikForm className="rounded-md bg-gray-100 p-4 dark:bg-gray-800 [&>div]:mb-4">
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
