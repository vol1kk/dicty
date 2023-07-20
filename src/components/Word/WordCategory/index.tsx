type WordCategoryProps = {
  name: string;
  children: React.ReactNode;
};

// fun fact: I could've used flex instead of grid, but
// I would've to wrap span into inline-flex div
export default function WordCategory({ name, children }: WordCategoryProps) {
  return (
    <div>
      <h3 className="relative grid grid-cols-[auto,_1fr] gap-4 text-xl">
        <span className="max-w-[20ch] truncate">{name}</span>
        <div className="h-[2px] w-full self-center rounded-md bg-gray-300 dark:bg-gray-900" />
      </h3>
      {children}
    </div>
  );
}
