import { SpinnerIcon } from "~/components/Icons";

export type SpinnerProps = {
  dimensions: number;
  text: string;
};

export default function Spinner({ dimensions = 24, text }: SpinnerProps) {
  return (
    <div role="status">
      <SpinnerIcon
        aria-hidden="true"
        width={dimensions}
        height={dimensions}
        className="inline animate-spin fill-primary text-gray-300 dark:fill-white
      dark:text-gray-600"
      />

      <span className="sr-only">{text}</span>
    </div>
  );
}
