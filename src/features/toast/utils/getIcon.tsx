import { type ToastType } from "~/features/toast/store/useToasts";
import SuccessIcon from "~/features/toast/assets/success.svg";
import ErrorIcon from "~/features/toast/assets/error.svg";
import WarningIcon from "~/features/toast/assets/warning.svg";
import clsx from "clsx";

export default function getIcon(type: ToastType, dimensions: number) {
  let icon;
  if (type === "success")
    icon = <SuccessIcon width={dimensions} heigth={dimensions} />;

  if (type === "error")
    icon = <ErrorIcon width={dimensions} heigth={dimensions} />;

  if (type === "warning")
    icon = <WarningIcon width={dimensions} heigth={dimensions} />;

  return (
    <div
      className={clsx(
        "relative isolate",
        type === "error" && "[&>svg]:fill-red-400",
        type === "warning" && "[&>svg]:fill-blue-400",
        type === "success" && "[&>svg]:fill-green-400",
      )}
    >
      {icon}
      <div className="absolute top-0 -z-[1] flex h-full w-full scale-50 items-center justify-center rounded-full bg-white" />
    </div>
  );
}
