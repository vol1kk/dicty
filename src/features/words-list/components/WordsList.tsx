import React, { forwardRef } from "react";
import { useTranslation } from "next-i18next";

import Word from "~/components/Word";
import Spinner from "~/components/Spinner";
import NotFound from "~/components/NotFound";
import Accordion from "~/components/Accordion";
import useSessionData from "~/store/useSessionData";
import { type Word as IWord } from "~/types/ApiTypes";

export type WordsListProps = {
  data: IWord[];
  isLoading: boolean;
};

const WordsList = forwardRef<HTMLLIElement, WordsListProps>(function WordsList(
  { data, isLoading },
  ref,
) {
  const { t } = useTranslation();
  const isAuthed = useSessionData(state => state.isAuthed);

  if (isLoading) {
    return (
      <Spinner
        containerClassName="flex justify-center"
        dimensions={64}
        text={t("load")}
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
    <ul
      className="grid gap-4"
      data-testid="words-list"
      aria-label={t("words.list")}
    >
      {data.map((word, index) => (
        <li
          key={word.id}
          aria-label={word.name}
          {...(index === 0 && { ref: ref })}
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
                  <Word.Category
                    id={category.id}
                    key={category.id}
                    categoryName={category.name}
                  >
                    <Word.Meanings
                      meanings={category.meanings}
                      associatedCategory={category.name}
                    />
                  </Word.Category>
                ))}
                {word.synonyms?.length > 0 && (
                  <Word.Category
                    id="word-synonyms"
                    categoryName={t("input.synonyms")}
                    className="mb-2 text-sm [&>h3]:text-base"
                  >
                    <Word.Synonyms
                      synonyms={word.synonyms}
                      words={data.map(w => ({ name: w.name, id: w.id }))}
                    />
                  </Word.Category>
                )}
                {word.antonyms?.length > 0 && (
                  <Word.Category
                    id="word-antonyms"
                    categoryName={t("input.antonyms")}
                    className="text-sm [&>h3]:text-base"
                  >
                    <Word.Synonyms
                      synonyms={word.antonyms}
                      words={data.map(w => ({ name: w.name, id: w.id }))}
                    />
                  </Word.Category>
                )}
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
});

export default WordsList;
