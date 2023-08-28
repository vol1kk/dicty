import clsx from "clsx";
import React from "react";

import { type Word } from "~/types/ApiTypes";

type WordSynonymsProps = {
  words: Word[];
  synonyms: string[];
};

export default function WordSynonyms({ words, synonyms }: WordSynonymsProps) {
  function scrollBy(y: number) {
    window.scrollBy({
      top: y,
      behavior: "smooth",
    });
  }

  function getWordBySynonym(id: string | undefined) {
    if (!id) return;

    const domElement = document.querySelector(
      `[data-testid='word-header-${id}']`,
    ) as HTMLDivElement;
    const parent = domElement.closest("li") as HTMLLIElement;

    if (domElement.ariaExpanded === "true")
      scrollBy(parent.getBoundingClientRect().y);

    domElement.ariaExpanded = "true";

    function transitionScrollListener() {
      scrollBy(parent.getBoundingClientRect().y);

      accordion.removeEventListener("transitionend", transitionScrollListener);
    }

    const accordion = parent?.querySelector(
      "[data-testid='accordion']",
    ) as HTMLDivElement;
    accordion.addEventListener("transitionend", transitionScrollListener);
  }

  return (
    <div className="mt-1 flex gap-2">
      {synonyms.map(synonym => {
        const existingWord = words.find(w => w.name === synonym);

        return (
          <span
            key={synonym}
            onClick={getWordBySynonym.bind(undefined, existingWord?.id)}
            className={clsx(
              existingWord &&
                "cursor-pointer underline-offset-2 hover:underline",
              "rounded-md bg-primary bg-opacity-30 px-2 py-1 aria-expanded:text-red-600 dark:bg-opacity-50",
            )}
          >
            {synonym}
          </span>
        );
      })}
    </div>
  );
}
