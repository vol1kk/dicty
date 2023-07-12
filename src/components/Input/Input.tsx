import { Field } from "formik";
import clsx from "clsx";

type InputProps = {
  id: string;
  isDarkTheme: boolean;
  labelCentered?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  id,
  children,
  className,
  isDarkTheme,
  placeholder,
  ...props
}: InputProps) {
  return (
    <label>
      {children}
      <Field
        className={clsx(
          isDarkTheme ? "bg-gray-900" : "bg-gray-300",
          "rounded-md p-2 placeholder-[#757575] outline-1 outline-offset-2 outline-primary focus-visible:outline",
          className,
        )}
        placeholder={placeholder}
        name={id}
        id={id}
        {...props}
      />
    </label>
  );
}
