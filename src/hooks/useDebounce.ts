import { useEffect, useState } from "react";

export default function useDebounce<T>(data: T, delay: number) {
  const [state, setState] = useState(data);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(data);
    }, delay);

    return () => clearTimeout(timeout);
  }, [data, delay]);

  return state;
}
