import {
  parseQuality,
  Qualities,
  type QualityValues,
  setRevisedWords,
  SuperMemo,
} from "~/features/quiz";
import React, { type MouseEvent, type SetStateAction } from "react";
import Button, { type ButtonProps } from "~/components/Button/Button";
import cn from "~/utils/cn";
import { useUpdateWord } from "~/features/word-edit";
import { useTranslation } from "next-i18next";
import { type Word } from "~/types/ApiTypes";
import { useRouter } from "next/router";

type QuizOptionsProps = {
  isClicked: boolean;
  selectedWord: Word;
  revisedWordsIds: string[];
  setRevisedWordsIds: React.Dispatch<SetStateAction<string[]>>;
  isLastWord: boolean;
  setIsClicked: React.Dispatch<SetStateAction<boolean>>;
};

export default function QuizOptions({
  isClicked,
  isLastWord,
  selectedWord,
  setRevisedWordsIds,
  revisedWordsIds,
  setIsClicked,
}: QuizOptionsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const updateWord = useUpdateWord();

  const handleNext = function getNext() {
    if (!isLastWord) {
      setIsClicked(false);
      if (!revisedWordsIds.includes(selectedWord.id))
        setRevisedWordsIds(prev => [...prev, selectedWord.id]);
    } else void router.replace("/");
  };

  const handleQualitySelect = function handleQualitySelect(
    e: MouseEvent<HTMLButtonElement>,
  ) {
    setIsClicked(true);

    const quality = e.currentTarget.dataset.quality as QualityValues;
    const revisingData = SuperMemo.getUpdatedValues(
      selectedWord.easinessFactor,
      selectedWord.repetitions,
      parseQuality(quality),
    );
    const updatedWord = { ...selectedWord, ...revisingData };

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
              <CustomButton
                className="uppercase tracking-widest"
                key={quality.dataset}
                data-quality={quality.dataset}
                onClick={handleQualitySelect}
              >
                {t(quality.name)}
              </CustomButton>
            ))
          ) : (
            <CustomButton onClick={handleNext}>
              {isLastWord ? t("quiz.finish") : t("quiz.next")}
            </CustomButton>
          )}
        </div>
      </div>
    </section>
  );
}

function CustomButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        "rounded-md bg-gray-300 p-4 transition-transform hover:scale-105 dark:bg-gray-800",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
