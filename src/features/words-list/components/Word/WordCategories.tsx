import React from "react";
import { Word } from "~/features/words-list";
import { type Category } from "~/types/ApiTypes";

export type WordCategoryProps = {
  categories: Category[];
};

// fun fact: I could've used flex instead of grid, but
// I would've to wrap span into inline-flex div
export default function WordCategories({ categories }: WordCategoryProps) {
  return (
    <div data-testid="word-categories">
      {categories.map(category => (
        <div key={category.id} data-testid={`category-${category.id}`}>
          <h3 className="relative grid grid-cols-[auto,_1fr] gap-4 text-xl">
            <span className="max-w-[20ch] truncate">{category.name}</span>
            <div className="h-[2px] w-full self-center rounded-md bg-gray-300 dark:bg-gray-900" />
          </h3>
          <Word.Meanings meanings={category.meanings} />
        </div>
      ))}
    </div>
  );
}
