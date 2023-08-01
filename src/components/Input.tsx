import { Field } from "formik";
import clsx from "clsx";
import React from "react";

type InputProps = {
  id: string;
  classNameLabel?: string;
  before?: boolean;
  labelCentered?: boolean;
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
        className={clsx(
          "rounded-md bg-gray-300 p-2 placeholder-[#757575] outline-1 outline-offset-2 outline-primary focus-visible:outline dark:bg-gray-900",
          className,
        )}
        placeholder={placeholder}
        name={id}
        id={id}
        {...props}
      />
      {!before && children}
    </label>
  );
}
