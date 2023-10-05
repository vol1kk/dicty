import cn from "~/utils/cn";
import { Button } from "~/components/Button";
import { ChevronIcon } from "~/components/Icons";

export type WordTitleProps = {
  name: string;
  classNameHeader?: string;
  classNameTranscription?: string;
  transcription: string;
};

export default function WordTitle({
  name,
  transcription,
  classNameHeader,
  classNameTranscription,
}: WordTitleProps) {
  return (
    <div data-testid="word-title">
      <h2 className={cn("text-4xl font-bold mobile:text-3xl", classNameHeader)}>
        <Button className="flex items-center gap-2">
          <span className="max-w-[25ch] truncate pb-1 mobile-small:max-w-[9ch]">
            {name}
          </span>
          <ChevronIcon
            height={20}
            aria-hidden={true}
            className={cn(
              "transition-transform group-aria-expanded/wordTitle:rotate-90 [&>path]:fill-gray-900",
            )}
          />
        </Button>
      </h2>
      <h3
        aria-hidden={true}
        className={cn(
          "text-lg text-primary mobile:text-center",
          classNameTranscription,
        )}
        onClick={e => e.stopPropagation()}
      >
        {transcription}
      </h3>
    </div>
  );
}
