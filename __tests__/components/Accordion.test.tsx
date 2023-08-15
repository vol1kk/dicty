import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Accordion, { type AccordionProps } from "~/components/Accordion";

function setup(props?: Partial<AccordionProps>) {
  const data = render(
    <Accordion isOpen={props?.isOpen ?? true}>Accordion</Accordion>,
  );

  const accordion = screen.getByTestId("accordion");

  return { data, accordion };
}

describe("Accordion Tests", function () {
  it("should render accordion", () => {
    const { accordion } = setup();

    expect(accordion).toBeInTheDocument();
  });

  it("should be hidden", () => {
    const { accordion } = setup({ isOpen: false });

    expect(accordion).toHaveClass("invisible grid-rows-[0fr]");
    expect(accordion).not.toHaveClass("grid-rows-[1fr]");
  });

  it("should be visible", () => {
    const { accordion } = setup({ isOpen: true });

    expect(accordion).toHaveClass("grid-rows-[1fr]");
    expect(accordion).not.toHaveClass("invisible grid-rows-[0fr]");
  });
});
