import Toast from "~/features/toast/components/Toast";
import { type ToastPosition, useToasts } from "~/features/toast";

export default function ToastList() {
  const { toasts, removeToast } = useToasts();

  const positions = toasts.reduce((data, toast) => {
    if (!data[toast.position]) data[toast.position] = 0;
    else data[toast.position] += 1;

    return data;
  }, {} as Record<ToastPosition, number>);
  const position = getMostFrequentKey(positions);
  const containerPosition = getContainerPosition(position);

  return (
    <ol tabIndex={-1} className={`fixed z-20 ${containerPosition}`}>
      {toasts.map(toast => (
        <li key={toast.id} className="m-4">
          <Toast
            toast={toast}
            closeToast={removeToast.bind(undefined, toast.id)}
            position={position}
          />
        </li>
      ))}
    </ol>
  );
}

function getMostFrequentKey(
  values: Record<ToastPosition, number>,
): ToastPosition {
  const entries = Object.keys(values) as ToastPosition[];
  const initialValue = entries.at(0) ?? "bottom-right";

  return entries.reduce((maxKey, currentKey) => {
    if (values[currentKey] > values[maxKey]) return currentKey;
    return maxKey;
  }, initialValue);
}

function getContainerPosition(position: ToastPosition) {
  if (position === "bottom-left") return "left-0 bottom-0";

  if (position === "bottom-right") return "right-0 bottom-0";

  if (position === "top-left") return "left-0 top-0";

  // top-right
  return "right-0 top-0";
}
