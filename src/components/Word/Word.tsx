import WordTitle from "~/components/Word/WordTitle";
import WordEdit from "~/components/Word/WordEdit";
import WordCategory from "~/components/Word/WordCategory";
import WordMeanings from "~/components/Word/WordMeanings";
import WordShare from "~/components/Word/WordShare";

type WordProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export function Word({ children, ...props }: WordProps) {
  return <div {...props}>{children}</div>;
}

Word.Title = WordTitle;
Word.Edit = WordEdit;
Word.Category = WordCategory;
Word.Meaning = WordMeanings;
Word.Share = WordShare;
