import { DotsIcon } from "~/components/Icons";
import formValidationSchema from "./lib/validationSchema";
import Form from "~/features/shared/ui/Form/components/Form";
import FormMeaning from "~/features/shared/ui/Form/components/FormMeaning";
import CategoryOptions from "~/features/shared/ui/Form/components/FormCategoryOptions";
import {
  formTemplate,
  categoryTemplate,
  meaningTemplate,
} from "~/features/shared/ui/Form/utils/formUtils";
import FormTitle from "~/features/shared/ui/Form/components/FormTitle";

export {
  DotsIcon,
  FormTitle,
  formTemplate,
  FormMeaning,
  CategoryOptions,
  meaningTemplate,
  categoryTemplate,
  formValidationSchema,
};
export default Form;
