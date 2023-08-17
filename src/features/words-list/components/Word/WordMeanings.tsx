import { type Meaning } from "~/types/ApiTypes";

export type WordMeaningsProps = {
  meanings: Meaning[];
  showExamples?: boolean;
};
export default function WordMeanings({
  meanings,
  showExamples = true,
}: WordMeaningsProps) {
  return (
    <ul
      data-testid="word-meanings"
      className="ml-8 list-disc marker:text-primary"
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
    </ul>
  );
}
