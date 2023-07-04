import Header from "~/components/Header/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="m-auto grid min-h-screen max-w-screen-md grid-rows-[auto,_1fr] p-6">
      <Header />
      {children}
    </div>
  );
}
