import { DictionaryIcon } from "~/components/Icons";

export type NotFoundProps = {
  dimensions: number;
  text: string;
};

export default function NotFound({ dimensions, text }: NotFoundProps) {
  return (
    <div
      data-testid="notfound-container"
      className="grid place-items-center gap-4"
    >
      <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800 [&>svg]:fill-black dark:[&>svg]:fill-white">
        <DictionaryIcon height={dimensions} width={dimensions} />
      </div>
      <h2
        data-testid="notfound-text"
        className="text-center text-xl font-bold uppercase tracking-widest"
      >
        {text}
      </h2>
    </div>
  );
}
