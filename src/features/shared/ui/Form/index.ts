import { DotsIcon } from "~/components/Icons";
import formValidationSchema from "./lib/validationSchema";
import Form from "~/features/shared/ui/Form/components/Form";
import prepareWord from "~/features/shared/ui/Form/utils/prepareWord";
import FormTitle from "~/features/shared/ui/Form/components/FormTitle";
import FormMeaning from "~/features/shared/ui/Form/components/FormMeaning";
import FormCategory from "~/features/shared/ui/Form/components/FormCategory";
import FormCategoryOptions from "~/features/shared/ui/Form/components/FormCategoryOptions";
import {
  formTemplate,
  categoryTemplate,
  meaningTemplate,
} from "~/features/shared/ui/Form/utils/formUtils";

export {
  DotsIcon,
  FormTitle,
  prepareWord,
  formTemplate,
  FormMeaning,
  FormCategory,
  meaningTemplate,
  categoryTemplate,
  FormCategoryOptions,
  formValidationSchema,
};
export default Form;
