import React from "react";

import WordEdit from "~/features/words-list/components/Word/WordEdit";
import WordTitle from "~/features/words-list/components/Word/WordTitle";
import WordShare from "~/features/words-list/components/Word/WordShare";
import WordHeader from "~/features/words-list/components/Word/WordHeader";
import WordCategory from "~/features/words-list/components/Word/WordCategory";
import WordMeanings from "~/features/words-list/components/Word/WordMeanings";
import WordSynonyms from "~/features/words-list/components/Word/WordSynonyms";
import cn from "~/utils/cn";

type WordProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export default function Word({ children, className, ...props }: WordProps) {
  return (
    <div
      className={cn(
        "break-words rounded-md bg-gray-100 p-4 dark:bg-gray-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Word.Edit = WordEdit;
Word.Title = WordTitle;
Word.Share = WordShare;
Word.Header = WordHeader;
Word.Synonyms = WordSynonyms;
Word.Meanings = WordMeanings;
Word.Category = WordCategory;
