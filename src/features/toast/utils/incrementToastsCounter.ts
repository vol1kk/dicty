import { type MutableRefObject } from "react";
import toastsCounterStore from "~/features/toast/store/toastsCounter";

export default function incrementToastsCounter(
  id: string,
  ref: MutableRefObject<number>,
  toastsCounter: Record<string, number> = toastsCounterStore,
) {
  ref.current += 1;
  toastsCounter[id] = ref.current;

  return ref.current;
}
