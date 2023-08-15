import { type SVGProps } from "react";

export default function AccountIcon(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id="account"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      width="24px"
      fill="#fff"
      {...props}
    >
      <path d="M10 9a6 6 0 1 1 6 6 6 6 0 0 1-6-6Zm16 20H6a3 3 0 0 1-3-3 9 9 0 0 1 9-9h8a9 9 0 0 1 9 9 3 3 0 0 1-3 3Z" />
    </svg>
  );
}
