import { useState } from "react";
import { useTranslation } from "next-i18next";

import Word from "~/components/Word/Word";
import { EditIcon } from "~/features/words-list";
import { type Word as IWord } from "~/types/ApiTypes";
import NotFound from "~/components/NotFound/NotFound";
import Accordion from "~/components/Accordion/Accordion";
import useSessionData from "~/store/useSessionData";

type WordsListProps = {
  data: IWord[];
};

export default function WordsList({ data }: WordsListProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const isAuthed = useSessionData(state => state.isAuthed);

  if (data.length === 0)
    return <NotFound dimensions={64} text={t("list.empty")} />;

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
                  width={24}
                  heigth={24}
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
              {isAuthed && (
                <Word.Share wordId={word.id} code={word.shareCode} />
              )}
            </Accordion>
          </Word>
        </li>
      ))}
    </ul>
  );
}
