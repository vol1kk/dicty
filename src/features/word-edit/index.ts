import useUpdateWord from "~/features/word-edit/hooks/useUpdateWord";
import FormEditWord from "~/features/word-edit/components/FormEditWord";
import useToggleShareCode from "~/features/word-edit/hooks/useToggleShareCode";
import useDeleteWord, {
  type UseDeleteWordInputs,
} from "~/features/word-edit/hooks/useDeleteWord";
import getModifiedWords from "~/features/word-edit/utils/getModifiedWords";

export { type UseDeleteWordInputs };

export { useUpdateWord, useDeleteWord, useToggleShareCode, getModifiedWords };
export default FormEditWord;
