import Link from "next/link";
import Chevron from "~/components/Icons/Chevron";
import clsx from "clsx";

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
        <Link
          href={`/dictionary/1`}
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-2 rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
        >
          <span className="max-w-[25ch] truncate">{word}</span>
          <Chevron
            className={clsx(
              "mt-1 transition-transform [&>path]:fill-gray-900",
              isAccordionOpen && "rotate-90 ",
            )}
          />
        </Link>
      </h2>
      <h3 className="relative text-lg text-primary">{transcription}</h3>
    </div>
  );
}
