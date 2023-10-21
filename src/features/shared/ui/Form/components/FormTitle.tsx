import cn from "~/utils/cn";

type FormTitleProps = {
  text: string;
  className: string;
};

export default function FormTitle({ text, className }: FormTitleProps) {
  return (
    <h2
      className={cn(
        "mx-auto w-fit select-none rounded-md bg-gray-300 px-2 py-1 text-xs font-extrabold uppercase tracking-widest dark:bg-gray-900",
        className,
      )}
    >
      {text}
    </h2>
  );
}
