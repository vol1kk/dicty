import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ToastIcon,
  type IToast,
  type ToastPosition,
  getTranslateDirection,
} from "~/features/toast";

type ToastProps = {
  toast: IToast;
  closeToast: () => void;
  position: ToastPosition;
};

export default function Toast({ toast, position, closeToast }: ToastProps) {
  const timeVisibleRef = useRef(0);
  const currentTimeRef = useRef(new Date());
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleToastDeletion = useCallback(() => {
    setIsMounted(false);

    toastRef.current?.addEventListener("transitionend", closeToast);
  }, [closeToast]);

  useEffect(() => {
    if (!isMounted) setIsMounted(true);

    const localToast = toastRef.current;
    return () => localToast?.removeEventListener("transitionend", closeToast);
  }, []); // eslint-disable-line

  useEffect(() => {
    const visibilityHandler = () => setIsPaused(document.hidden);
    const pauseHandler = () => setIsPaused(true);
    const unpauseHandler = () => setIsPaused(false);

    if (toast.pauseOnBlur) {
      document.addEventListener("visibilitychange", visibilityHandler);
      window.addEventListener("blur", pauseHandler);
      window.addEventListener("focus", unpauseHandler);
    }

    if (toast.pauseOnHover) {
      toastRef.current?.addEventListener("mouseleave", unpauseHandler);
      toastRef.current?.addEventListener("mouseenter", pauseHandler);
    }

    const interval = setInterval(() => {
      if (!isPaused && toast.autoClose && progressRef.current) {
        timeVisibleRef.current += +new Date() - +currentTimeRef.current;

        progressRef.current.style.width = `${
          (1 - timeVisibleRef.current / toast.autoClose) * 100
        }%`;

        if (timeVisibleRef.current >= toast.autoClose) handleToastDeletion();
      }

      currentTimeRef.current = new Date();
    }, 5);

    const localToastRef = toastRef.current;

    return () => {
      if (toast.pauseOnBlur) {
        document.removeEventListener("visibilitychange", visibilityHandler);
        window.removeEventListener("blur", pauseHandler);
        window.removeEventListener("focus", unpauseHandler);
      }

      if (toast.pauseOnHover) {
        localToastRef?.removeEventListener("mouseenter", pauseHandler);
        localToastRef?.removeEventListener("mouseleave", unpauseHandler);
      }

      if (interval) clearInterval(interval);
    };
  }, [
    isPaused,
    toast.autoClose,
    toast.pauseOnHover,
    handleToastDeletion,
    toast.pauseOnBlur,
  ]);

  return (
    <div
      ref={toastRef}
      tabIndex={0}
      className={clsx(
        isMounted ? "translate-[0%,_0%]" : getTranslateDirection(position),
        position.endsWith("-right") && "ml-auto",
        position.endsWith("-left") && "mr-auto",
        "group/toast relative max-w-fit overflow-hidden rounded-md bg-gray-300 px-7 py-6 shadow-2xl outline-2 outline-offset-2 outline-primary transition-transform focus-visible:outline dark:bg-gray-800",
      )}
    >
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <ToastIcon type={toast.type} dimensions={28} />
          {toast.text}
        </div>
        {toast.action}
      </div>

      <button
        className="absolute right-0 top-0 mr-2 mt-2 opacity-0 transition-opacity group-hover/toast:opacity-100"
        onClick={handleToastDeletion}
      >
        &#x2715;
      </button>

      {toast.autoClose && (
        <div
          ref={progressRef}
          className="absolute inset-x-0 bottom-0  h-1 bg-primary"
        />
      )}
    </div>
  );
}
