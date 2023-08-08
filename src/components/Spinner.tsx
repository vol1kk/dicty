import SpinnerIcon from "~/assets/spinner.svg";

type SpinnerProps = {
  dimensions: number;
};

export default function Spinner({ dimensions = 24 }: SpinnerProps) {
  return (
    <div role="status">
      <SpinnerIcon
        width={dimensions}
        heigth={dimensions}
        aria-hidden="true"
        className="inline animate-spin fill-primary text-gray-300 dark:fill-white
      dark:text-gray-600"
      />

      <span className="sr-only">Loading...</span>
    </div>
  );
}
