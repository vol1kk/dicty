import { type Icon } from "~/types/Icon";

export default function AccountIcon({
  dimensions = 36,
  fill = "#757575",
  ...props
}: Icon) {
  return (
    <svg
      id="account"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      height={dimensions}
      width={dimensions}
      fill={fill}
      {...props}
    >
      <path d="M10 9a6 6 0 1 1 6 6 6 6 0 0 1-6-6Zm16 20H6a3 3 0 0 1-3-3 9 9 0 0 1 9-9h8a9 9 0 0 1 9 9 3 3 0 0 1-3 3Z"></path>
    </svg>
  );
}
