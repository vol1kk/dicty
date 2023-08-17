import clsx from "clsx";

import Button from "~/components/Button/Button";
import { ChevronIcon } from "~/components/Icons";

export type WordTitleProps = {
  name: string;
  transcription: string;
};

export default function WordTitle({ name, transcription }: WordTitleProps) {
  return (
    <div data-testid="word-title">
      <h2 className="text-4xl font-bold">
        <Button className="flex items-center gap-2 rounded-md">
          <span className="max-w-[25ch] truncate pb-1">{name}</span>
          <ChevronIcon
            height={20}
            aria-hidden={true}
            className={clsx(
              "transition-transform group-aria-expanded/wordTitle:rotate-90 [&>path]:fill-gray-900",
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
