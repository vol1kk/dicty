import React from "react";
import cn from "~/utils/cn";

import Word from "~/components/Word";
import { type Word as IWord } from "~/types/ApiTypes";

type QuizWordProps = {
  word: IWord;
  isClicked: boolean;
};

export default function QuizWord({ word, isClicked }: QuizWordProps) {
  return (
    <Word>
      <Word.Title
        name={word.name}
        classNameHeader="w-fit mx-auto text-3xl [&>button]:cursor-text [&>button]:select-text [&>*>svg]:hidden"
        classNameTranscription="text-center"
        transcription={word.transcription}
      />
      <div className="mb-2">
        {word.categories.map(category => (
          <Word.Category
            key={category.id}
            categoryName={category.name}
            className={cn(
              !isClicked && "blur-sm",
              "transition-[filter] duration-200",
            )}
          >
            <Word.Meanings meanings={category.meanings} />
          </Word.Category>
        ))}
      </div>
    </Word>
  );
}
