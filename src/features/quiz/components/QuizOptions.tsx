import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { type Word } from "~/types/ApiTypes";
import { Button } from "~/components/Button";
import { useUpdateWord } from "~/features/word-edit";
import {
  Qualities,
  getRevisedWord,
  setRevisedWords,
  type QualityValues,
} from "~/features/quiz";

type QuizOptionsProps = {
  words: Word[];
  isClicked: boolean;
  selectedWord: Word;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setRevisedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function QuizOptions({
  words,
  isClicked,
  selectedWord,
  setRevisedIds,
  setIsClicked,
}: QuizOptionsProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const updateWord = useUpdateWord();

  const isLastWord = words.length === 1;

  const handleNext = function getNext() {
    if (isLastWord) void router.replace("/quiz");

    if (!isLastWord) {
      setIsClicked(false);
      setRevisedIds(revisedIds =>
        revisedIds.includes(selectedWord.id)
          ? revisedIds
          : [...revisedIds, selectedWord.id],
      );
    }
  };

  const handleQualitySelect: React.MouseEventHandler<HTMLButtonElement> =
    function handleQualitySelect(e) {
      setIsClicked(true);

      const quality = e.currentTarget.dataset.quality as QualityValues;
      const updatedWord = getRevisedWord(selectedWord, quality);

      updateWord(updatedWord);
      setRevisedWords(updatedWord, quality);
    };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="my-2 rounded-md bg-gray-800 py-2 text-center font-bold uppercase tracking-widest">
          {isClicked ? "Successfully Rated" : t("quality.options")}
        </h1>
        <div className="grid auto-cols-fr grid-flow-col gap-4 mobile:grid-flow-row">
          {!isClicked ? (
            Qualities.map(quality => (
              <Button
                className="p-4 uppercase tracking-widest transition-transform hover:scale-105"
                key={quality.dataset}
                data-quality={quality.dataset}
                onClick={handleQualitySelect}
              >
                {t(quality.name)}
              </Button>
            ))
          ) : (
            <Button className="p-4" onClick={handleNext}>
              {isLastWord ? t("quiz.finish") : t("quiz.next")}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
