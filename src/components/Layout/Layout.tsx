import Header from "~/components/Header/Header";
import useUserPreferences from "~/store/useUserPreferences";

type LayoutProps = {
  children: React.ReactNode;
};

const FONTS = new Map([
  ["mono", "font-inconsolata"],
  ["serif", "font-merriweather"],
  ["sans-serif", "font-poppins"],
]);

export default function Layout({ children }: LayoutProps) {
  const font = useUserPreferences(state => state.font);
  const getFont = FONTS.get(font) ?? "font-poppins";
  return (
    <div
      className={`m-auto grid min-h-screen max-w-screen-md grid-rows-[auto,_1fr] px-6 py-12 ${getFont}`}
    >
      <Header />
      {children}
    </div>
  );
}
