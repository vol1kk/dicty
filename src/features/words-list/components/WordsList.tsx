import React from "react";
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

  function toggleAriaExpanded(e: React.MouseEvent<HTMLSpanElement>) {
    if (e.currentTarget.ariaExpanded === null)
      e.currentTarget.ariaExpanded = "true";

    e.currentTarget.ariaExpanded =
      e.currentTarget.ariaExpanded === "true" ? "false" : "true";
  }

  return (
    <ul data-testid="words-list" className="grid gap-4">
      {data.map(word => (
        <li
          key={word.id}
          className="rounded-md bg-gray-100 p-4 dark:bg-gray-800"
        >
          <Word>
            <Word.Header
              aria-expanded={false}
              onClick={toggleAriaExpanded}
              className="group/wordTitle peer"
              data-testid={`word-header-${word.id}`}
            >
              <Word.Title name={word.name} transcription={word.transcription} />
              <Word.Edit wordId={word.id} />
            </Word.Header>
            <Accordion strategy={{ aria: true }}>
              <div className="mb-2">
                {word.categories.map(category => (
                  <Word.Category key={category.id} categoryName={category.name}>
                    <Word.Meanings meanings={category.meanings} />
                  </Word.Category>
                ))}
                <Word.Category
                  className="text-sm [&>h3]:text-base"
                  categoryName="Synonyms"
                >
                  <Word.Synonyms
                    words={data}
                    synonyms={["Smart", "Wise", "Clever"]}
                  />
                </Word.Category>
              </div>
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
