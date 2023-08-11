import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Is working?", function () {
  const renderBtn = <button>Random Test</button>;

  it("should render text", () => {
    render(renderBtn);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should not have 3 as text content", () => {
    render(renderBtn);
    expect(screen.getByRole("button")).not.toHaveTextContent("3");
  });
});
