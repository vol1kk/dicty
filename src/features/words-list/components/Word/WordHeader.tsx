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
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {props?.children}
    </div>
  );
}
