import clsx from "clsx";
import useUserPreferences from "~/store/useUserPreferences";

type WordCategoryProps = {
  name: string;
  children: React.ReactNode;
};
export default function WordCategory({ name, children }: WordCategoryProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  return (
    <div key={name}>
      <h3 className="relative flex gap-4 text-xl">
        {name}
        <div
          className={clsx(
            isDarkTheme ? "bg-gray-900" : "bg-gray-300",
            "h-[2px] w-full self-center rounded-md",
          )}
        />
      </h3>
      {children}
    </div>
  );
}
