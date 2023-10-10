import FormEditWord from "~/features/word-edit/components/FormEditWord";
import useUpdateWord from "~/features/word-edit/hooks/useUpdateWord";
import useDeleteWord, {
  type UseDeleteWordInputs,
} from "~/features/word-edit/hooks/useDeleteWord";
import useToggleShareCode from "~/features/word-edit/hooks/useToggleShareCode";

export { type UseDeleteWordInputs };

export { useUpdateWord, useDeleteWord, useToggleShareCode };
export default FormEditWord;
