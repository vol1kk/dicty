import { type api } from "~/utils/api";
import type basicMutateCallback from "~/features/shared/utils/basicMutateCallback";

type BasicErrorCallback = {
  context: Awaited<ReturnType<typeof basicMutateCallback>>;
  utils: ReturnType<typeof api.useContext>;
};

export default function basicErrorCallback({
  utils,
  context,
}: BasicErrorCallback) {
  utils.words.getAll.setData(context.queryKey, context.previousData);
  utils.words.getDictionaries.setData(undefined, context.previousDictionaries);
}
