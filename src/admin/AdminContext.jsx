import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_CATEGORIES,
  initialAbout,
  initialGallery,
  initialMenus,
} from './data/initialData';
import { newId, slugify } from './utils';
import usePersistentState from './hooks/usePersistentState';

const AdminContext = createContext(null);

// ⚠️ Hanya untuk demo. Kredensial di kode frontend bisa dilihat siapa pun lewat
// DevTools, jadi ini BUKAN keamanan sungguhan. Ganti dengan autentikasi backend
// begitu server tersedia.
export const DEMO_CREDENTIALS = { username: 'admin', password: 'solo123' };
const AUTH_KEY = 'rps_admin_auth';

// Kunci localStorage. Naikkan angka versinya bila bentuk datanya berubah.
const MENUS_KEY = 'rps_menus_v1';
const CATEGORIES_KEY = 'rps_categories_v1';
const ORDERS_KEY = 'rps_orders_v1';

export const ORDER_STATUS = { PENDING: 'pending', DONE: 'done' };

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

// Nomor pesanan: PS-261112-K3X9 (tanggal + 4 karakter acak)
function makeOrderId(existing) {
  const d = new Date();
  const ymd =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  let id;
  do {
    id = `PS-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  } while (existing.some((o) => o.id === id));
  return id;
}

function readAuth() {
  try {
    return window.sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

function writeAuth(value) {
  try {
    if (value) window.sessionStorage.setItem(AUTH_KEY, '1');
    else window.sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* sessionStorage tidak tersedia: abaikan */
  }
}

export function AdminProvider({ children }) {
  const [menus, setMenus, menusFailed] = usePersistentState(MENUS_KEY, initialMenus);
  const [categories, setCategories, categoriesFailed] = usePersistentState(
    CATEGORIES_KEY,
    DEFAULT_CATEGORIES
  );
  const [orders, setOrders, ordersFailed] = usePersistentState(ORDERS_KEY, []);
  const [gallery, setGallery] = useState(initialGallery);
  const [about, setAbout] = useState(initialAbout);
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);

  const login = useCallback((username, password) => {
    const ok =
      username.trim() === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password;
    if (ok) {
      writeAuth(true);
      setIsAuthenticated(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    writeAuth(false);
    setIsAuthenticated(false);
  }, []);

  // --- Menu ---
  const addMenu = useCallback((data) => {
    setMenus((prev) => {
      // id berupa slug nama ("es-teh-manis") agar alamat /menu/:id rapi dan unik
      const base = slugify(data.name);
      let id = base;
      let n = 2;
      while (prev.some((m) => m.id === id)) id = `${base}-${n++}`;
      return [...prev, { ...data, id }];
    });
  }, []);
  const updateMenu = useCallback(
    (id, data) =>
      setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m))),
    []
  );
  const deleteMenu = useCallback(
    (id) => setMenus((prev) => prev.filter((m) => m.id !== id)),
    []
  );

  // --- Kategori ---
  // Mengembalikan { ok: true } atau { ok: false, error: 'pesan' } agar form bisa menampilkannya.
  const addCategory = useCallback(
    (name) => {
      const clean = String(name).trim().replace(/\s+/g, ' ');
      if (!clean) return { ok: false, error: 'Nama kategori wajib diisi.' };
      if (categories.some((c) => sameName(c, clean))) {
        return { ok: false, error: `Kategori "${clean}" sudah ada.` };
      }
      setCategories((prev) => [...prev, clean]);
      return { ok: true, name: clean };
    },
    [categories, setCategories]
  );

  const renameCategory = useCallback(
    (oldName, newName) => {
      const clean = String(newName).trim().replace(/\s+/g, ' ');
      if (!clean) return { ok: false, error: 'Nama kategori wajib diisi.' };
      if (categories.some((c) => c !== oldName && sameName(c, clean))) {
        return { ok: false, error: `Kategori "${clean}" sudah ada.` };
      }
      setCategories((prev) => prev.map((c) => (c === oldName ? clean : c)));
      // menu yang memakai kategori lama ikut berganti nama
      setMenus((prev) => prev.map((m) => (m.category === oldName ? { ...m, category: clean } : m)));
      return { ok: true, name: clean };
    },
    [categories, setCategories, setMenus]
  );

  const deleteCategory = useCallback(
    (name) => {
      const used = menus.filter((m) => m.category === name).length;
      if (used > 0) {
        return {
          ok: false,
          error: `Kategori "${name}" masih dipakai ${used} menu. Pindahkan atau hapus menunya dulu.`,
        };
      }
      setCategories((prev) => prev.filter((c) => c !== name));
      return { ok: true };
    },
    [menus, setCategories]
  );

  // --- Pesanan (dibuat pembeli di halaman Pesanan, dikelola admin) ---
  // payload: { customer: { name, phone }, method, items: [{ id, name, price, qty }] }
  // Mengembalikan pesanan yang tersimpan (lengkap dengan nomor & total).
  const addOrder = useCallback(
    ({ customer, method, items }) => {
      const order = {
        id: makeOrderId(orders),
        createdAt: new Date().toISOString(),
        customer: { name: customer.name.trim(), phone: customer.phone.trim() },
        method,
        items,
        totalItems: items.reduce((sum, i) => sum + i.qty, 0),
        total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
        status: ORDER_STATUS.PENDING,
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [orders, setOrders]
  );

  const setOrderStatus = useCallback(
    (id, status) =>
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    [setOrders]
  );

  // --- Galeri ---
  const addPhoto = useCallback((data) => {
    const id = newId();
    setGallery((prev) => [{ ...data, id }, ...prev]);
  }, []);
  const deletePhoto = useCallback(
    (id) => setGallery((prev) => prev.filter((p) => p.id !== id)),
    []
  );

  // --- Tentang Kami ---
  const saveAbout = useCallback(
    (data) => setAbout((prev) => ({ ...prev, ...data })),
    []
  );

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      menus,
      addMenu,
      updateMenu,
      deleteMenu,
      categories,
      addCategory,
      renameCategory,
      deleteCategory,
      orders,
      addOrder,
      setOrderStatus,
      storageFailed: menusFailed || categoriesFailed || ordersFailed,
      gallery,
      addPhoto,
      deletePhoto,
      about,
      saveAbout,
    }),
    [
      isAuthenticated,
      login,
      logout,
      menus,
      addMenu,
      updateMenu,
      deleteMenu,
      categories,
      addCategory,
      renameCategory,
      deleteCategory,
      orders,
      addOrder,
      setOrderStatus,
      menusFailed,
      categoriesFailed,
      ordersFailed,
      gallery,
      addPhoto,
      deletePhoto,
      about,
      saveAbout,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin harus dipakai di dalam <AdminProvider>.');
  }
  return ctx;
}
