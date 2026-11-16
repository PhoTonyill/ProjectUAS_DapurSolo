import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './DesainUMKM.css';
import Header from './Header.jsx';
import HomePage from './HomePage.jsx';
import MenuPage from './MenuPage.jsx';
import OrderPage from './OrderPage.jsx';
import Cart from './Cart.jsx';
import Receipt from './Receipt.jsx';
import { parsePrice } from './cartUtils.js';
import AdminApp from './admin/AdminApp.jsx';
import { useAdmin } from './admin/AdminContext.jsx';
import './BootstrapTheme.css'; // harus paling akhir agar menimpa CSS lain

// Mengatur posisi scroll setiap pindah halaman atau pindah #bagian
function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const scrollToTarget = () =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      // Beri waktu halaman baru untuk dirender sebelum mencari elemennya
      const timer = setTimeout(scrollToTarget, 50);
      return () => clearTimeout(timer);
    }
    window.scrollTo({ top: 0 });
  }, [location.key]);

  return null;
}

export default function App() {
  // Data menu sekarang berasal dari dashboard admin (awalnya sama dengan menuData.js)
  const { menus, addOrder } = useAdmin();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  // Keranjang disimpan di memori saja: { idMenu: jumlah }
  const [cart, setCart] = useState({});

  const cartLines = menus.filter((item) => cart[item.id] > 0).map((item) => ({
    item,
    qty: cart[item.id],
  }));
  const cartCount = cartLines.reduce((sum, line) => sum + line.qty, 0);

  const addToCart = (item, qty) => {
    setCart((current) => ({ ...current, [item.id]: (current[item.id] || 0) + qty }));
  };

  const changeQty = (id, qty) => {
    setCart((current) => {
      const next = { ...current };
      if (qty < 1) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const removeFromCart = (id) => changeQty(id, 0);
  const clearCart = () => setCart({});

  // Checkout: simpan pesanan (localStorage, dibaca dashboard admin), kosongkan keranjang,
  // lalu kembalikan pesanan agar halaman Pesanan bisa membuka struknya.
  const checkout = ({ customer, method }) => {
    const order = addOrder({
      customer,
      method,
      items: cartLines.map(({ item, qty }) => ({
        id: item.id,
        name: item.name,
        price: parsePrice(item.price),
        qty,
      })),
    });
    clearCart();
    return order;
  };

  return (
    <>
      <ScrollManager />
      {!isAdminRoute && <Header cartCount={cartCount} />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage cart={cart} />} />
          <Route path="/menu/:id" element={<OrderPage cart={cart} onSave={addToCart} />} />
          <Route
            path="/pesanan"
            element={
              <Cart
                lines={cartLines}
                onChangeQty={changeQty}
                onRemove={removeFromCart}
                onClear={clearCart}
                onCheckout={checkout}
              />
            }
          />
          <Route path="/struk/:id" element={<Receipt />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <footer>
          <h3>&copy; 2026 Restoran Pria Solo. All Rights Reserved.</h3>
        </footer>
      )}
    </>
  );
}
