import Input from "~/components/Input/Input";
import { FieldArray, Form as FormikForm, Formik } from "formik";
import Button from "~/components/Button/Button";
import useUserPreferences from "~/store/useUserPreferences";
import FormCategory from "~/components/Form/FormCategory";
import clsx from "clsx";

type FormProps = {
  initialValues: {
    name: string;
    transcription: string;
    categories: [
      {
        name: string;
        meanings: [
          {
            definition: string;
            example: string;
          },
        ];
      },
    ];
  };
};

const categoryTemplate = {
  name: "",
  meanings: [{ definition: "", example: "" }],
};

export type Push<T> = { push: (data: T) => void };

export default function Form({ initialValues }: FormProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const formSubmitHandler = values => console.log(values);

  return (
    <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
      {({ values: word, isValid }) => (
        <FormikForm className="px-2 py-4">
          <div className="flex flex-wrap gap-4 [&>label>span]:text-center [&>label]:grid [&>label]:grow">
            <Input id="name" placeholder="Enter Name" isDarkTheme={isDarkTheme}>
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
          <h2 className="text-center">Categories</h2>
          <FieldArray name="categories">
            {({ push: pushCategory }: Push<typeof categoryTemplate>) => (
              <div>
                {word.categories.map((category, cIndex) => (
                  <FormCategory
                    key={cIndex}
                    category={category}
                    index={cIndex}
                  />
                ))}
                <Button
                  className={clsx(
                    isDarkTheme ? "bg-gray-900" : "bg-gray-300",
                    "mx-auto block w-1/2 rounded-md p-3",
                  )}
                  onClick={() =>
                    pushCategory({
                      name: "",
                      meanings: [{ definition: "", example: "" }],
                    })
                  }
                >
                  Add Category
                </Button>
              </div>
            )}
          </FieldArray>
          <Button
            disabled={!isValid}
            isSubmit={true}
            className={clsx(
              isDarkTheme ? "bg-gray-900" : "bg-gray-300",
              "mx-auto mt-4 block w-full rounded-md p-3",
            )}
          >
            Add Word
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
}
