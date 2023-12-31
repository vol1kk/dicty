import React from "react";
import cn from "~/utils/cn";

export type SwitchProps = {
  before?: boolean;
  isChecked: boolean;
  switchAction: string;
  handleCheck: () => void;
  children?: React.ReactNode;
};

export default function Switch({
  children,
  switchAction,
  isChecked,
  handleCheck,
  before = false,
}: SwitchProps) {
  return (
    <label
      data-testid="switch-container"
      className="group flex cursor-pointer gap-2"
    >
      <button
        role="switch"
        onClick={handleCheck}
        className="peer sr-only"
        aria-checked={isChecked}
      >
        {switchAction}
      </button>
      {before && children}
      <div className="relative block h-6 w-12 rounded-full border-4 border-transparent bg-gray-600 outline-2 outline-offset-2 outline-primary peer-focus-visible:outline dark:bg-primary [&~svg]:hover:fill-primary dark:[&~svg]:fill-primary">
        <span
          className={cn(
            "absolute left-0 h-4 w-4 rounded-full bg-white transition-all",
            isChecked && "left-6",
          )}
        />
      </div>
      {!before && children}
    </label>
  );
}
