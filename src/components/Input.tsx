import React from "react";
import { Field } from "formik";

import cn from "~/utils/cn";

type InputProps = {
  id: string;
  classNameLabel?: string;
  before?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  id,
  children,
  className,
  placeholder,
  classNameLabel,
  before = true,
  ...props
}: InputProps) {
  return (
    <label className={classNameLabel}>
      {before && children}
      <Field
        id={id}
        name={id}
        placeholder={placeholder}
        className={cn(
          "rounded-md bg-gray-300 p-2 placeholder-[#757575] outline-1 outline-offset-2 outline-primary focus-visible:outline dark:bg-gray-900",
          className,
        )}
        {...props}
      />
      {!before && children}
    </label>
  );
}
