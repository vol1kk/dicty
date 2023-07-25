import clsx from "clsx";
import { type SetStateAction } from "react";
import Chevron from "~/components/Icons/Chevron";
import Button from "~/components/Button/Button";

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
            aria-hidden={true}
            className={clsx(
              "mt-1 transition-transform [&>path]:fill-gray-900",
              isAccordionOpen && "rotate-90 ",
            )}
          />
        </Button>
      </h2>
      <h3 aria-hidden={true} className="text-lg text-primary">
        {transcription}
      </h3>
    </div>
  );
}
