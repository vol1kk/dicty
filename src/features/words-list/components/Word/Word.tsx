import React from "react";

import WordEdit from "~/features/words-list/components/Word/WordEdit";
import WordTitle from "~/features/words-list/components/Word/WordTitle";
import WordShare from "~/features/words-list/components/Word/WordShare";
import WordMeanings from "~/features/words-list/components/Word/WordMeanings";
import WordHeader from "~/features/words-list/components/Word/WordHeader";
import WordCategories from "~/features/words-list/components/Word/WordCategories";

type WordProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export default function Word({ children, ...props }: WordProps) {
  return <div {...props}>{children}</div>;
}

Word.Edit = WordEdit;
Word.Title = WordTitle;
Word.Share = WordShare;
Word.Header = WordHeader;
Word.Meanings = WordMeanings;
Word.Categories = WordCategories;
