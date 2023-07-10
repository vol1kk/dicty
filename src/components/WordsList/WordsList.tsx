import clsx from "clsx";
import { useState } from "react";
import EditIcon from "~/components/Icons/EditIcon";
import Accordion from "~/components/Accordion/Accordion";
import WordTitle from "~/components/Word/WordTitle";
import WordCategory from "~/components/Word/WordCategory";
import WordMeanings from "~/components/Word/WordMeanings";
import useUserPreferences from "~/store/useUserPreferences";
import WordEdit from "~/components/Word/WordEdit";
import { type Word } from "~/utils/placeholder";

type WordsListProps = {
  data: Word[];
};

export default function WordsList({ data }: WordsListProps) {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  return (
    <ul className="[&>li]:mb-4">
      {data.map((word, i) => (
        <li
          key={word.name}
          className={clsx(
            isDarkTheme && "bg-gray-800",
            !isDarkTheme && "bg-gray-100",
            "rounded-md p-4",
          )}
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
              <EditIcon className="transition-transform group-hover:scale-110 group-hover:fill-primary" />
            </WordEdit>
          </div>
          <Accordion isOpen={isOpen === i}>
            {word.categories.map(category => (
              <WordCategory key={category.name} name={category.name}>
                <WordMeanings meanings={category.meanings} />
              </WordCategory>
            ))}
          </Accordion>
        </li>
      ))}
    </ul>
  );
}
