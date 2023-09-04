import React from "react";

import cn from "~/utils/cn";

export type AccordionProps = {
  strategy: { aria: true } | { aria?: false; isOpen: boolean };
  children: React.ReactNode;
};

export default function Accordion({ children, strategy }: AccordionProps) {
  return (
    <div
      data-testid="accordion"
      className={cn(
        `grid transition-[grid-template-rows]`,
        strategy?.aria &&
          `invisible grid-rows-[0fr] peer-aria-expanded:visible peer-aria-expanded:grid-rows-[1fr]`,

        !strategy?.aria && strategy.isOpen
          ? "grid-rows-[1fr]"
          : "invisible grid-rows-[0fr]",
      )}
    >
      <div data-testid="accordion-content" className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}
