import { type Meaning } from "~/types/ApiTypes";
import { useTranslation } from "next-i18next";

export type WordMeaningsProps = {
  meanings: Meaning[];
  showExamples?: boolean;
  associatedCategory: string;
};
export default function WordMeanings({
  meanings,
  associatedCategory,
  showExamples = true,
}: WordMeaningsProps) {
  const { t } = useTranslation();

  return (
    <ol
      data-testid="word-meanings"
      className="ml-8 list-disc marker:text-primary"
      aria-label={t("definition", { count: 0 }) + ` ${associatedCategory}`}
    >
      {meanings.map(meaning => (
        <li
          key={meaning.id}
          data-testid={`meaning-${meaning.id}`}
          className="mb-2 text-justify"
        >
          <p data-testid="meaning-definition">{meaning.definition}</p>
          {showExamples && (
            <p data-testid="meaning-example" className="ml-5 text-[#757575]">
              {meaning.example}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
