import { parseQuality, type QualityValues, SuperMemo } from "~/features/quiz";
import { type SuperMemoValues } from "~/features/quiz/utils/SuperMemo";

export default function getRevisedWord<T extends SuperMemoValues>(
  data: T,
  quality: QualityValues,
) {
  const updatedData = SuperMemo.getUpdatedValues(
    data.easinessFactor,
    data.repetitions,
    parseQuality(quality),
  );

  return { ...data, ...updatedData };
}
