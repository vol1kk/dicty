import clsx from "clsx";

type DropdownProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

export default function Accordion({ children, isOpen }: DropdownProps) {
  return (
    <div
      aria-expanded={isOpen}
      className={clsx(
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        "grid transition-[grid-template-rows]",
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
