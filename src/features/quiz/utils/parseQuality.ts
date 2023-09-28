import { type QualityValues } from "~/features/quiz";

export default function parseQuality(quality: QualityValues) {
  switch (quality) {
    case "bad":
      return 1;
    case "moderate":
      return 3;
    case "good":
      return 5;
    default:
      assertNever(quality);
  }
}

function assertNever(x: never): never {
  throw new Error(
    `Exhaustive switch failed. Passed value is not of type never: `,
    x,
  );
}
