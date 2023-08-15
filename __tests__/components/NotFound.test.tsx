import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";

import NotFound, { type NotFoundProps } from "~/components/NotFound";

function setup(props?: Partial<NotFoundProps>) {
  const text = props?.text || "NotFound.test.tsx";
  const dimensions = props?.dimensions || 24;

  const data = render(<NotFound dimensions={dimensions} text={text} />);

  const notFoundContainer = screen.getByTestId("notfound-container");
  const notFoundImage = screen.getByTestId("notfound-icon");
  const notFoundText = screen.getByTestId("notfound-text");

  return {
    data,
    text,
    dimensions: dimensions.toString(),
    notFoundImage,
    notFoundText,
    notFoundContainer,
  };
}

describe("NotFound Tests", () => {
  it("should render notfound", () => {
    const { notFoundContainer } = setup();

    expect(notFoundContainer).toBeInTheDocument();
  });

  it("should render notfound with provided dimensions", () => {
    const { notFoundImage, dimensions } = setup();

    expect(notFoundImage).toHaveAttribute("width", dimensions);
    expect(notFoundImage).toHaveAttribute("height", dimensions);
  });

  it("should render notfound with provided text", () => {
    const { notFoundText, text } = setup();

    expect(notFoundText).toHaveTextContent(text);
  });
});
