import assertNever from "~/utils/assertNever";
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
