import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, renderHook, screen } from "@testing-library/react";

import { ExportWords } from "~/features/import-export-words";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import * as downloadDataModule from "~/features/import-export-words/utils/downloadData";
import useWords from "~/hooks/useWords";

function setup() {
  const hookData = renderHook(() => useWords(null));
  const data = render(<ExportWords words={hookData.result.current} />, {
    wrapper: MemoryRouterProvider,
  });

  const exportContainer = screen.getByTestId("export-words-container");

  return { data, exportContainer };
}

vi.mock("~/features/import-export-words/utils/downloadData", () => ({
  default: vi.fn(),
}));

describe("ExportWords tests", function () {
  it("should render ExportWords", () => {
    const { exportContainer } = setup();

    expect(exportContainer).toBeInTheDocument();
  });

  it("should call downloadData on exportContainer click", () => {
    const { exportContainer } = setup();

    fireEvent.click(exportContainer);
    expect(downloadDataModule.default).toHaveBeenCalled();
  });
});
