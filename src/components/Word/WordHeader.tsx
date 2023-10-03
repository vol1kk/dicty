import React, { type HTMLAttributes } from "react";

import cn from "~/utils/cn";

export default function WordHeader({
  className,
  ...props
}: Partial<HTMLAttributes<HTMLDivElement>> & {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mobile:mb-2 mobile:flex-col",
        className,
      )}
      {...props}
    >
      {props?.children}
    </div>
  );
}
