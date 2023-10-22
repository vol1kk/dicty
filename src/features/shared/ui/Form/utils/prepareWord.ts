import { type Word } from "~/types/ApiTypes";

export type ValuesFromForm = Omit<Word, "synonyms" | "antonyms"> & {
  synonyms: string;
  antonyms: string;
};

export type TransformForForm = {
  data: Word;
  transformFor: "form";
};

export type TransformForApi = {
  data: ValuesFromForm;
  transformFor: "api";
};

export default function prepareWord(props: TransformForForm): ValuesFromForm;
export default function prepareWord(props: TransformForApi): Word;
export default function prepareWord(
  props: TransformForForm | TransformForApi,
): ValuesFromForm | Word {
  if (props.transformFor === "form") {
    return {
      ...props.data,
      language: props.data.language || "",
      dictionary: props.data.dictionary || "",
      synonyms: props.data.synonyms.join(", ") || "",
      antonyms: props.data.antonyms.join(", ") || "",
    };
  }

  const transformedSynonyms = convertStringToArray(props.data.synonyms);
  const transformedAntonyms = convertStringToArray(props.data.antonyms);
  return {
    ...props.data,
    synonyms: transformedSynonyms,
    antonyms: transformedAntonyms,
    language: props.data.language || null,
    dictionary: props.data.dictionary || null,
  };
}

export function convertStringToArray(str: string) {
  return str
    .split(",")
    .map(s => s.trim())
    .filter(s => s !== "");
}
