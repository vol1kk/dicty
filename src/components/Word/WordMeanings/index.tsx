import { type Meaning } from "~/utils/placeholder";

type WordMeaningsProps = {
  meanings: Meaning[];
  showExamples?: boolean;
};
export default function WordMeanings({
  meanings,
  showExamples = true,
}: WordMeaningsProps) {
  return (
    <ul className="ml-8 list-disc marker:text-primary">
      {meanings.map(meaning => (
        <li key={meaning.definition} className="mb-2 text-justify">
          {meaning.definition}
          {showExamples && (
            <p className="ml-5 text-[#757575]">{meaning.exampleSentences}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
