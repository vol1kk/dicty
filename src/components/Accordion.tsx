import clsx from "clsx";
import React from "react";

export type AccordionProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

export default function Accordion({ children, isOpen }: AccordionProps) {
  return (
    <div
      data-testid="accordion"
      className={clsx(
        isOpen ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        "grid transition-[grid-template-rows]",
      )}
    >
      <div data-testid="accordion-content" className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}
