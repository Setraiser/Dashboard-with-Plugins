import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return debouncedValue;
}
