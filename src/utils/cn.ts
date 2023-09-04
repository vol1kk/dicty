import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export default function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
