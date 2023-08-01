import ImportWords from "~/features/import-words/components/ImportWords";
import readFileAsync from "~/features/import-words/utils/readFileAsync";
import useImportWords from "~/features/import-words/hooks/useImportWords";
import ImportIcon from "~/features/import-words/assets/import.svg";

export { useImportWords, readFileAsync, ImportIcon };
export default ImportWords;
