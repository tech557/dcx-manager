import { useCallback, useState } from 'react';

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((current) => !current), []);
  const open = useCallback(() => setValue(true), []);
  const close = useCallback(() => setValue(false), []);

  return [value, toggle, open, close] as const;
}
