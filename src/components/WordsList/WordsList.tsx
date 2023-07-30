import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Word } from "~/components/Word/Word";
import EditIcon from "~/components/Icons/EditIcon";
import { type Word as IWord } from "~/types/ApiTypes";
import Accordion from "~/components/Accordion/Accordion";
import DictionaryIcon from "~/components/Icons/DictionaryIcon";

type WordsListProps = {
  data: IWord[];
};

export default function WordsList({ data }: WordsListProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <DictionaryIcon dimensions={64} />
        </div>
        <h2>{t("list.empty")}</h2>
      </div>
    );
  }

  return (
    <ul className="grid gap-4">
      {data.map((word, i) => (
        <li
          key={word.id}
          className="rounded-md bg-gray-100 p-4 dark:bg-gray-800"
        >
          <Word onClick={() => setIsOpen(curr => (curr === i ? null : i))}>
            <div className="flex items-center justify-between">
              <Word.Title
                word={word.name}
                isAccordionOpen={isOpen === i}
                transcription={word.transcription}
              />
              <Word.Edit href={`/edit/${word.id}`}>
                <EditIcon
                  aria-hidden={true}
                  className="transition-transform group-hover:scale-110 group-hover:fill-primary"
                />
              </Word.Edit>
            </div>
            <Accordion isOpen={isOpen === i}>
              {word.categories.map(category => (
                <Word.Category key={category.id} name={category.name}>
                  <Word.Meaning meanings={category.meanings} />
                </Word.Category>
              ))}
              <Word.Share wordId={word.id} code={word.shareCode} />
            </Accordion>
          </Word>
        </li>
      ))}
    </ul>
  );
}
