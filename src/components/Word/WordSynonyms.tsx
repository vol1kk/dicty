import React from "react";

import cn from "~/utils/cn";
import { type Word } from "~/types/ApiTypes";

export type WordSynonymsProps = {
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
    const offset = parent.getBoundingClientRect().y;

    if (domElement.ariaExpanded === "true") scrollBy(offset);
    domElement.ariaExpanded = "true";

    const accordion = parent?.querySelector(
      "[data-testid='accordion']",
    ) as HTMLDivElement;
    accordion.addEventListener("transitionend", transitionScrollListener);

    function transitionScrollListener() {
      scrollBy(offset);
      accordion.removeEventListener("transitionend", transitionScrollListener);
    }
  }

  return (
    <ul data-testid="word-synonyms" className="mt-1 flex gap-2">
      {synonyms.map(synonym => {
        const existingWord = words.find(w => w.name === synonym);

        return (
          <li
            key={synonym}
            data-testid={"synonym-" + synonym.toLowerCase().replaceAll(" ", "")}
            onClick={getWordBySynonym.bind(undefined, existingWord?.id)}
            className={cn(
              existingWord &&
                "cursor-pointer underline-offset-2 hover:underline",
              "rounded-md bg-primary bg-opacity-30 px-2 py-1 aria-expanded:text-red-600 dark:bg-opacity-50",
            )}
          >
            {synonym}
          </li>
        );
      })}
    </ul>
  );
}
