import clsx from "clsx";

import Button from "~/components/Button/Button";
import { ChevronIcon } from "~/components/Icons";

type WordTitleProps = {
  word: string;
  transcription: string;
  isAccordionOpen: boolean;
};

export default function WordTitle({
  word,
  transcription,
  isAccordionOpen,
}: WordTitleProps) {
  return (
    <div>
      <h2 className="text-4xl font-bold">
        <Button className="flex items-center gap-2 rounded-md">
          <span className="max-w-[25ch] truncate pb-1">{word}</span>
          <ChevronIcon
            width={18}
            height={18}
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
