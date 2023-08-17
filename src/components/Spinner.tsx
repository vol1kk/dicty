import { SpinnerIcon } from "~/components/Icons";
import clsx from "clsx";

export type SpinnerProps = {
  text: string;
  dimensions: number;
  containerClassName?: string;
  spinnerClassName?: string;
};

export default function Spinner({
  dimensions = 24,
  text,
  containerClassName,
  spinnerClassName,
}: SpinnerProps) {
  return (
    <div role="status" className={containerClassName}>
      <SpinnerIcon
        aria-hidden="true"
        width={dimensions}
        height={dimensions}
        className={clsx(
          "inline animate-spin fill-primary text-gray-300 dark:fill-white dark:text-gray-600",
          spinnerClassName,
        )}
      />

      <span className="sr-only">{text}</span>
    </div>
  );
}
