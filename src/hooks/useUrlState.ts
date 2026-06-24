import { useState, useCallback } from 'react';

/**
 * Custom hook to sync form state with URL search params.
 * On mount, reads URL params to pre-fill values.
 * On change, uses replaceState to update URL without navigation.
 */
export function useUrlState(
  paramName: string,
  defaultValue: string = '',
): [string, (value: string) => void] {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName) || defaultValue;
  });

  const setValueAndUrl = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      if (newValue && newValue !== defaultValue) {
        params.set(paramName, newValue);
      } else {
        params.delete(paramName);
      }
      const qs = params.toString();
      const newUrl = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [paramName, defaultValue],
  );

  return [value, setValueAndUrl];
}

/**
 * Read a numeric URL param on mount and provide setter that also updates URL.
 */
export function useUrlNumber(
  paramName: string,
  defaultValue: number = 0,
): [number, (value: number) => void] {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(paramName);
    if (!raw) return defaultValue;
    const n = parseFloat(raw);
    return isNaN(n) ? defaultValue : n;
  });

  const setValueAndUrl = useCallback(
    (newValue: number) => {
      setValue(newValue);
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      if (newValue !== defaultValue) {
        params.set(paramName, String(newValue));
      } else {
        params.delete(paramName);
      }
      const qs = params.toString();
      const newUrl = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [paramName, defaultValue],
  );

  return [value, setValueAndUrl];
}

/**
 * Build the current page URL including search params, for sharing.
 */
export function getCurrentUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}
