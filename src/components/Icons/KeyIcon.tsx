import { type SVGProps } from "react";

export default function KeyIcon(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      width="24px"
      height="24px"
      fill="#fff"
      {...props}
    >
      <path d="M 18.5 3 C 13.806 3 10 6.806 10 11.5 C 10 12.542294 10.19765 13.536204 10.541016 14.458984 L 3 22 L 3 27 L 8 27 L 8 24 L 11 24 L 11 21 L 14 21 L 15.541016 19.458984 C 16.463796 19.80235 17.457706 20 18.5 20 C 23.194 20 27 16.194 27 11.5 C 27 6.806 23.194 3 18.5 3 z M 20.5 7 C 21.881 7 23 8.119 23 9.5 C 23 10.881 21.881 12 20.5 12 C 19.119 12 18 10.881 18 9.5 C 18 8.119 19.119 7 20.5 7 z" />
    </svg>
  );
}
