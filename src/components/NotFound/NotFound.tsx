import DictionaryIcon from "~/components/Icons/DictionaryIcon";

type NotFoundProps = {
  dimensions: number;
  text: string;
};

export default function NotFound({ dimensions, text }: NotFoundProps) {
  return (
    <div className="grid place-items-center gap-4">
      <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <DictionaryIcon dimensions={dimensions} />
      </div>
      <h2>{text}</h2>
    </div>
  );
}
