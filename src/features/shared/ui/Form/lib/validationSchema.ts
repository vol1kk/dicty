import { string, object, array } from "yup";

const formValidationSchema = object({
  name: string().required(),
  transcription: string(),
  synonyms: string(),
  categories: array()
    .min(1, "At least one category should be present")
    .of(
      object({
        name: string().required("Category name is required"),
        meanings: array()
          .min(1)
          .of(
            object().shape({
              definition: string().required(),
              example: string(),
            }),
          ),
      }),
    ),
});

export default formValidationSchema;
