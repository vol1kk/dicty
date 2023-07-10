import Link from "next/link";
import Chevron from "~/components/Icons/Chevron";
import clsx from "clsx";
import Button from "~/components/Button/Button";
import { type SetStateAction } from "react";

type WordTitleProps = {
  word: string;
  index: number;
  transcription: string;
  isAccordionOpen: boolean;
  setAccordionOpen: React.Dispatch<SetStateAction<number | null>>;
};
export default function WordTitle({
  word,
  index,
  setAccordionOpen,
  transcription,
  isAccordionOpen,
}: WordTitleProps) {
  return (
    <div>
      <h2 className="text-4xl font-bold">
        <Button
          onClick={e => {
            e.stopPropagation();
            setAccordionOpen(curr => (curr === index ? null : index));
          }}
          className="flex items-center gap-2 rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
        >
          <span className="max-w-[25ch] truncate">{word}</span>
          <Chevron
            className={clsx(
              "mt-1 transition-transform [&>path]:fill-gray-900",
              isAccordionOpen && "rotate-90 ",
            )}
          />
        </Button>
      </h2>
      <h3 className="relative text-lg text-primary">{transcription}</h3>
    </div>
  );
}
