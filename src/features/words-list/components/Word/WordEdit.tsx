import React from "react";
import Link from "next/link";
import { EditIcon } from "~/components/Icons";

export type WordEditProps = {
  wordId: string;
};

export default function WordEdit({ wordId }: WordEditProps) {
  return (
    <Link
      data-testid="word-edit"
      href={"/edit/" + wordId}
      onClick={e => e.stopPropagation()}
      className="group rounded-full bg-primary bg-opacity-30 p-4 outline-2 outline-offset-2 outline-primary transition-transform hover:scale-105 focus-visible:outline dark:bg-gray-900 [&>svg]:fill-primary dark:[&>svg]:fill-[#757575]"
    >
      <span className="sr-only">Edit word</span>
      <EditIcon
        width={24}
        height={24}
        aria-hidden={true}
        className="transition-transform group-hover:scale-110 group-hover:fill-primary"
      />
    </Link>
  );
}
