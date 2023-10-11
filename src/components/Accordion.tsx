import React from "react";

import cn from "~/utils/cn";

export type AccordionProps = {
  className?: string;
  children: React.ReactNode;
  strategy: { aria: true } | { aria?: false; isOpen: boolean };
};

export default function Accordion({
  children,
  className,
  strategy,
}: AccordionProps) {
  return (
    <div
      data-testid="accordion"
      className={cn(
        `grid transition-[grid-template-rows,_visibility]`,
        strategy?.aria &&
          `invisible grid-rows-[0fr] peer-aria-expanded:visible peer-aria-expanded:grid-rows-[1fr]`,

        !strategy?.aria && strategy.isOpen
          ? "grid-rows-[1fr]"
          : "invisible grid-rows-[0fr]",
        className,
      )}
    >
      <div data-testid="accordion-content" className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}
