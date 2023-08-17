import { useState } from "react";
import { useTranslation } from "next-i18next";

import Spinner from "~/components/Spinner";
import { Word } from "~/features/words-list";
import NotFound from "~/components/NotFound";
import Accordion from "~/components/Accordion";
import useSessionData from "~/store/useSessionData";
import { type Word as IWord } from "~/types/ApiTypes";

export type WordsListProps = {
  data: IWord[];
  isLoading: boolean;
};

export default function WordsList({ data, isLoading }: WordsListProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(-1);
  const isAuthed = useSessionData(state => state.isAuthed);

  if (isLoading) {
    return (
      <Spinner
        containerClassName="flex justify-center"
        dimensions={64}
        text={`${t("spinner.load")}...`}
      />
    );
  }

  if (data.length === 0)
    return <NotFound dimensions={64} text={t("list.empty")} />;

  return (
    <ul data-testid="words-list" className="grid gap-4">
      {data.map((word, i) => (
        <li
          key={word.id}
          className="rounded-md bg-gray-100 p-4 dark:bg-gray-800"
        >
          <Word>
            <Word.Header
              data-testid={`word-header-${word.id}`}
              className="group/wordTitle"
              aria-expanded={isOpen === i}
              onClick={() => setIsOpen(curr => (curr === i ? -1 : i))}
            >
              <Word.Title name={word.name} transcription={word.transcription} />
              <Word.Edit wordId={word.id} />
            </Word.Header>
            <Accordion isOpen={isOpen === i}>
              <Word.Categories categories={word.categories} />
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
