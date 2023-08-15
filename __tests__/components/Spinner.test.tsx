import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Spinner, { type SpinnerProps } from "~/components/Spinner";

function setup(props?: Partial<SpinnerProps>) {
  const dimensions = props?.dimensions || 24;
  const text = props?.text || "Spinner Test";

  const data = render(<Spinner text={text} dimensions={dimensions} />);

  const spinner = screen.getByTestId("spinner");

  return { data, dimensions: dimensions.toString(), text, spinner };
}

describe("Spinner Tests", function () {
  it("should render spinner", () => {
    const { spinner } = setup();

    expect(spinner).toBeInTheDocument();
  });

  it("should render spinner with provided dimensions", () => {
    const { spinner, dimensions } = setup();

    expect(spinner).toHaveAttribute("width", dimensions);
    expect(spinner).toHaveAttribute("height", dimensions);
  });

  it("should render spinner with provided text", () => {
    const { spinner, text } = setup();

    expect(spinner.nextElementSibling).toHaveTextContent(text);
  });
});
