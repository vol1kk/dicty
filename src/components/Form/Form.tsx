import { FieldArray, Form as FormikForm, Formik } from "formik";
import clsx from "clsx";
import Input from "~/components/Input/Input";
import Button from "~/components/Button/Button";
import { type WordWithoutId } from "~/utils/placeholder";
import FormCategory from "~/components/Form/FormCategory";
import useUserPreferences from "~/store/useUserPreferences";
import { type FieldArrayHelpers } from "~/types/FieldArrayHelpers";

type FormProps = {
  isFormOpen: boolean;
  initialValues: WordWithoutId;
};

export default function Form({ initialValues, isFormOpen }: FormProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  const formSubmitHandler = (values: WordWithoutId) => console.log(values);
  function firstFormItem(e: React.FocusEvent<HTMLInputElement>) {
    const items = e.target.closest(".accordion")?.nextElementSibling;

    const firstItemHeader = items?.querySelector("h2 > button") as HTMLElement;

    if (!isFormOpen) firstItemHeader.focus();
  }
  function lastFormItem(e: React.FocusEvent<HTMLButtonElement>) {
    const accordionTitle = e.target.closest(".accordion")
      ?.firstElementChild as HTMLElement;

    if (!isFormOpen) accordionTitle?.focus();
  }

  return (
    <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
      {({ values: word, isValid }) => (
        <FormikForm className="px-2 py-4 [&>div]:mb-4">
          <div className="flex flex-wrap gap-4 [&>label>span]:text-center [&>label]:grid [&>label]:grow">
            <Input
              onFocus={firstFormItem}
              id="name"
              placeholder="Enter Name"
              isDarkTheme={isDarkTheme}
            >
              <span>Name</span>
            </Input>

            <Input
              id="transcription"
              placeholder="Enter Transcription"
              isDarkTheme={isDarkTheme}
            >
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
          <div className="flex gap-4">
            <Button
              disabled={!isValid}
              isSubmit={true}
              className={clsx(
                isDarkTheme ? "bg-gray-900" : "bg-gray-300",
                "mx-auto block flex-grow-[5] rounded-md px-4 py-2",
              )}
            >
              Add Word
            </Button>
            <Button
              onFocus={lastFormItem}
              isSubmit={true}
              className={clsx(
                isDarkTheme ? "bg-gray-900" : "bg-gray-300",
                "mx-auto block flex-grow rounded-md px-4 py-2",
              )}
            >
              Cancel
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
}
