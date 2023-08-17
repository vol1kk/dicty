import React, { type HTMLAttributes } from "react";
import clsx from "clsx";

export default function WordHeader({
  className,
  ...props
}: Partial<HTMLAttributes<HTMLDivElement>> & {
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx("flex items-center justify-between", className)}
      {...props}
    >
      {props?.children}
    </div>
  );
}
