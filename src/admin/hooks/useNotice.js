import { useCallback, useEffect, useRef, useState } from 'react';

/** Pesan notifikasi singkat yang hilang sendiri (mis. "Menu berhasil ditambahkan"). */
export default function useNotice(timeout = 3500) {
  const [notice, setNotice] = useState(null);
  const timer = useRef(null);

  const show = useCallback(
    (message, variant = 'success') => {
      clearTimeout(timer.current);
      setNotice({ message, variant });
      timer.current = setTimeout(() => setNotice(null), timeout);
    },
    [timeout]
  );

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setNotice(null);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { notice, show, hide };
}
