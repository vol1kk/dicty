import React from "react";

import cn from "~/utils/cn";
import assertNever from "~/utils/assertNever";
import { type QualityValues } from "~/features/quiz";
import { CloseIcon, TickIcon, WarningIcon } from "~/components/Icons";

export default function getQualityIcon(quality: QualityValues) {
  const baseClasses =
    "translate-y-1/2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 w-[14px]";

  switch (quality) {
    case "bad":
      return <CloseIcon className={cn(baseClasses, "fill-red-500")} />;
    case "moderate":
      return <WarningIcon className={cn(baseClasses, "fill-orange-500")} />;
    case "good":
      return <TickIcon className={cn(baseClasses, "fill-green-500")} />;
    default:
      assertNever(quality);
  }
}
