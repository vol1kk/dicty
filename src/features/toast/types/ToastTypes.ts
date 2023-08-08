import type React from "react";

export type ToastType = "success" | "error" | "warning";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface IToast {
  id: string;
  text: string;
  type: ToastType;
  pauseOnBlur: boolean;
  pauseOnHover: boolean;
  position: ToastPosition;
  autoClose: false | number;
  action: null | React.ReactElement;
}
