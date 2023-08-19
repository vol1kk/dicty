import clsx from "clsx";

import { type ToastType } from "~/features/toast";
import ErrorIcon from "~/components/Icons/ErrorIcon";
import SuccessIcon from "~/components/Icons/SuccessIcon";
import WarningIcon from "~/components/Icons/WarningIcon";

export type ToastIconProps = {
  type: ToastType;
  dimensions: number;
};

export default function ToastIcon({ type, dimensions }: ToastIconProps) {
  let icon;
  if (type === "success")
    icon = <SuccessIcon data-testid="icon-success" width={dimensions} />;

  if (type === "error")
    icon = <ErrorIcon data-testid="icon-error" width={dimensions} />;

  if (type === "warning")
    icon = <WarningIcon data-testid="icon-warning" width={dimensions} />;

  return (
    <div
      data-testid="toast-icon-container"
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
