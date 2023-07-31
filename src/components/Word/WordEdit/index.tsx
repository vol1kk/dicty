import React from "react";
import Link from "next/link";

type WordEditProps = {
  href: string;
  children: React.ReactNode;
};

export default function WordEdit({ href, children }: WordEditProps) {
  return (
    <Link
      href={href}
      onClick={e => e.stopPropagation()}
      className="group rounded-full bg-primary bg-opacity-30 p-4 outline-2 outline-offset-2 outline-primary transition-transform hover:scale-105 focus-visible:outline dark:bg-gray-900 [&>svg]:fill-primary dark:[&>svg]:fill-[#757575]"
    >
      <span className="sr-only">Edit word</span>
      {children}
    </Link>
  );
}
