import { type Dispatch, type SetStateAction } from "react";
import { FieldArray, Form as FormikForm, Formik } from "formik";
import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import { type WordWithoutId } from "~/utils/placeholder";
import FormCategory from "~/components/Form/FormCategory";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";

type FormProps = {
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  initialValues: WordWithoutId;
};

export default function Form({ initialValues, setIsFormOpen }: FormProps) {
  const formSubmitHandler = (values: WordWithoutId) => console.log(values);

  return (
    <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
      {({ values: word, isValid, resetForm }) => (
        <FormikForm className="px-2 py-4 pb-6 [&>div]:mb-4">
          <div className="flex flex-wrap gap-4 [&>label>span]:text-center [&>label]:grid [&>label]:grow">
            <Input id="name" placeholder="Enter Name">
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
                {word.categories.map((category, cIndex) => (
                  <FormCategory
                    key={cIndex}
                    category={category}
                    categoryIndex={cIndex}
                    push={arrayHelpers.push}
                    remove={arrayHelpers.remove}
                    categoriesLength={word.categories.length}
                  />
                ))}
              </div>
            )}
          </FieldArray>
          <div className="flex gap-4 [&>button:first-child]:flex-grow-[5] [&>button:last-child]:flex-grow [&>button]:px-4 [&>button]:py-2">
            <Button
              disabled={!isValid}
              isSubmit={true}
              className="rounded-md bg-gray-300 dark:bg-gray-900"
            >
              Add Word
            </Button>
            <Button
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
              className="rounded-md bg-gray-300 dark:bg-gray-900"
            >
              Cancel
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
}
