import { expect, afterEach, vi } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

afterEach(function () {
  cleanup();
  vi.restoreAllMocks();
});

expect.extend(matchers);
