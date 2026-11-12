import { useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/utils';

/**
 * Runs an async loader on mount and whenever `arg` changes, tracking its result.
 * `load` must be stable (a module-level service method), or the effect re-runs every render.
 * While a new `arg` loads, the previous data stays on screen (no flash).
 */
export function useAsync<T, A = undefined>(load: (arg: A) => Promise<T>, arg?: A) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    load(arg as A)
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((e) => active && setError(getErrorMessage(e)))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [load, arg]);

  return { data, isLoading, error };
}
