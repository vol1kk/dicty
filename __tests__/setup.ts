import { expect, afterEach, vi } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

afterEach(function () {
  cleanup();
  vi.restoreAllMocks();
});

vi.mock("next-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

expect.extend(matchers);
