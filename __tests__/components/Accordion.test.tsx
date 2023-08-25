import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Accordion, { type AccordionProps } from "~/components/Accordion";

function setup(props?: Partial<AccordionProps> & { expanded?: boolean }) {
  const data = render(
    <>
      <div
        className="peer"
        data-testid="accordion-title"
        aria-expanded={props?.expanded}
      />
      <Accordion strategy={props?.strategy ?? { aria: true }}>
        Accordion
      </Accordion>
    </>,
  );

  const accordion = screen.getByTestId("accordion");
  const accordionTitle = screen.getByTestId("accordion-title");

  return { data, accordion, accordionTitle };
}

describe("Accordion Tests", function () {
  it("should render accordion", () => {
    const { accordion } = setup();

    expect(accordion).toBeInTheDocument();
  });

  it("should be hidden using isOpen strategy", () => {
    const { accordion } = setup({ strategy: { isOpen: false } });

    expect(accordion).toHaveClass("invisible grid-rows-[0fr]");
    expect(accordion).not.toHaveClass("grid-rows-[1fr]");
  });

  it("should be visible using isOpen strategy", () => {
    const { accordion } = setup({ strategy: { isOpen: true } });

    expect(accordion).toHaveClass("grid-rows-[1fr]");
    expect(accordion).not.toHaveClass("invisible grid-rows-[0fr]");
  });

  it("should be hidden using aria strategy", () => {
    const { accordionTitle } = setup({
      strategy: { aria: true },
      expanded: false,
    });

    expect(accordionTitle).toHaveAttribute("aria-expanded", "false");
  });

  it("should be visible using aria strategy", () => {
    const { accordionTitle } = setup({
      strategy: { aria: true },
      expanded: true,
    });

    expect(accordionTitle).toHaveAttribute("aria-expanded", "true");
  });
});
