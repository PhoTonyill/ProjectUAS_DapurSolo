import { useCallback, useEffect, useRef, useState } from 'react';

function read(key, fallback, validate) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * useState yang disimpan di localStorage.
 * - Data awal ('fallback') baru ditulis ke localStorage setelah ada perubahan,
 *   jadi mengubah data awal di kode tidak "tertahan" oleh data lama.
 * - Perubahan dari tab lain (event "storage") ikut diterapkan, sehingga admin
 *   yang membuka dashboard di satu tab langsung melihat pesanan dari tab lain.
 * - Mengembalikan [nilai, setNilai, gagalSimpan]. `gagalSimpan` bernilai true
 *   bila penyimpanan penuh / diblokir browser (mis. foto base64 terlalu besar).
 */
export default function usePersistentState(key, fallback, validate = Array.isArray) {
  const [value, setValue] = useState(() => read(key, fallback, validate));
  const [failed, setFailed] = useState(false);
  const dirty = useRef(false);

  const set = useCallback((updater) => {
    dirty.current = true;
    setValue(updater);
  }, []);

  useEffect(() => {
    if (!dirty.current) return;
    dirty.current = false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) return;
      setValue(read(key, fallback, validate));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // fallback & validate sengaja tidak jadi dependensi (nilai awal tetap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set, failed];
}
