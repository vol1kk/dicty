export const toastUpdate = "toast-update";
export const toastCreate = "toast-create";
export const toastDelete = "toast-delete";

export const DefaultOptions = {
  action: null,
  type: "success",
  autoClose: 5000,
  text: "Success!",
  isOpen: true,
  pauseOnBlur: true,
  pauseOnHover: true,
  position: "bottom-right",
} as const;
