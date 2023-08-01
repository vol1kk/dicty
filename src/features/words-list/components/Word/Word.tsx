import React from "react";
import WordTitle from "~/features/words-list/components/Word/WordTitle";
import WordEdit from "~/features/words-list/components/Word/WordEdit";
import WordCategory from "~/features/words-list/components/Word/WordCategory";
import WordMeanings from "~/features/words-list/components/Word/WordMeanings";
import WordShare from "~/features/words-list/components/Word/WordShare";

type WordProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export default function Word({ children, ...props }: WordProps) {
  return <div {...props}>{children}</div>;
}

Word.Title = WordTitle;
Word.Edit = WordEdit;
Word.Category = WordCategory;
Word.Meaning = WordMeanings;
Word.Share = WordShare;
