import { type ToastPosition } from "~/features/toast";

export default function getTranslateDirection(position: ToastPosition) {
  if (position === "bottom-left" || position === "top-left")
    return "-translate-x-[120%]";

  // bottom-right || top-right
  return "translate-x-[120%]";
}
