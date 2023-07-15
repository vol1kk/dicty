import { useState } from "react";
import { type Word } from "~/utils/placeholder";
import EditIcon from "~/components/Icons/EditIcon";
import Accordion from "~/components/Accordion/Accordion";
import WordTitle from "~/components/Word/WordTitle";
import WordCategory from "~/components/Word/WordCategory";
import WordMeanings from "~/components/Word/WordMeanings";
import WordEdit from "~/components/Word/WordEdit";
import DictionaryIcon from "~/components/Icons/DictionaryIcon";

type WordsListProps = {
  data: Word[];
};

export default function WordsList({ data }: WordsListProps) {
  const [isOpen, setIsOpen] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <DictionaryIcon dimensions={64} />
        </div>
        <h2>Your dictionary is empty!</h2>
      </div>
    );
  }

  return (
    <ul className="[&>li]:mb-4">
      {data.map((word, i) => (
        <li
          key={word.id}
          className="rounded-md bg-gray-100 p-4 dark:bg-gray-800"
        >
          <div
            onClick={() => setIsOpen(curr => (curr === i ? null : i))}
            className="flex items-center justify-between"
          >
            <WordTitle
              index={i}
              word={word.name}
              setAccordionOpen={setIsOpen}
              isAccordionOpen={isOpen === i}
              transcription={word.transcription}
            />
            <WordEdit href={"/edit/1"}>
              <EditIcon
                aria-hidden={true}
                className="transition-transform group-hover:scale-110 group-hover:fill-primary"
              />
            </WordEdit>
          </div>
          <Accordion isOpen={isOpen === i}>
            {word.categories.map(category => (
              <WordCategory key={category.id} name={category.name}>
                <WordMeanings meanings={category.meanings} />
              </WordCategory>
            ))}
          </Accordion>
        </li>
      ))}
    </ul>
  );
}
