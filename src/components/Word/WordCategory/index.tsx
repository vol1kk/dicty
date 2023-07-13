type WordCategoryProps = {
  name: string;
  children: React.ReactNode;
};

export default function WordCategory({ name, children }: WordCategoryProps) {
  return (
    <div>
      <h3 className="relative flex gap-4 text-xl">
        {name}
        <div className="h-[2px] w-full self-center rounded-md bg-gray-300 dark:bg-gray-900" />
      </h3>
      {children}
    </div>
  );
}
