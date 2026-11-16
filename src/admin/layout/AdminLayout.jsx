import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Alert, Button, Offcanvas } from 'react-bootstrap';
import { ORDER_STATUS, useAdmin } from '../AdminContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Ringkasan', icon: '🏠', end: true },
  { to: '/admin/pesanan', label: 'Pesanan Masuk', icon: '🧾', badgeKey: 'pending' },
  { to: '/admin/menu', label: 'Manajemen Menu', icon: '🍽️' },
  { to: '/admin/kategori', label: 'Kategori', icon: '🏷️' },
  { to: '/admin/galeri', label: 'Galeri', icon: '🖼️' },
  { to: '/admin/tentang', label: 'Tentang Kami', icon: '📖' },
];

function SidebarContent({ onNavigate }) {
  const { logout, orders } = useAdmin();
  const pending = orders.filter((o) => o.status === ORDER_STATUS.PENDING).length;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-sidebar-content">
      <div className="admin-brand">
        <span className="admin-brand-mark" aria-hidden="true">
          PS
        </span>
        <div>
          <div className="admin-brand-name">Pria Solo</div>
          <div className="admin-brand-sub">Panel Admin</div>
        </div>
      </div>

      <nav className="admin-nav" aria-label="Menu admin">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="admin-nav-link"
            onClick={onNavigate}
          >
            <span className="admin-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
            {item.badgeKey === 'pending' && pending > 0 && (
              <span className="admin-nav-badge" aria-label={`${pending} pesanan belum selesai`}>
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-nav-link" onClick={onNavigate}>
          <span className="admin-nav-icon" aria-hidden="true">
            🌐
          </span>
          Lihat situs
        </Link>
        <button type="button" className="admin-nav-link" onClick={handleLogout}>
          <span className="admin-nav-icon" aria-hidden="true">
            🚪
          </span>
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { storageFailed } = useAdmin();

  return (
    <div className="admin-root admin-shell">
      {/* Sidebar desktop */}
      <aside className="admin-sidebar d-none d-lg-flex">
        <SidebarContent />
      </aside>

      <div className="admin-main">
        {/* Topbar mobile */}
        {/* Sengaja <div>, bukan <header>: DesainUMKM.css menata tag <header> secara global */}
        <div className="admin-topbar d-lg-none">
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu navigasi"
          >
            ☰
          </Button>
          <span className="admin-topbar-title">Pria Solo · Admin</span>
        </div>

        <main className="admin-content">
          {storageFailed && (
            <Alert variant="warning" className="admin-alert">
              <strong>Penyimpanan browser penuh.</strong> Perubahan terbaru mungkin tidak
              tersimpan dan hilang saat halaman dimuat ulang. Kurangi ukuran foto menu
              (atau pakai alamat gambar) lalu coba lagi.
            </Alert>
          )}
          <Outlet />
        </main>
      </div>

      {/* Sidebar mobile (offcanvas) */}
      <Offcanvas
        show={menuOpen}
        onHide={() => setMenuOpen(false)}
        className="admin-offcanvas"
        aria-labelledby="admin-offcanvas-title"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title id="admin-offcanvas-title" className="visually-hidden">
            Menu navigasi admin
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent onNavigate={() => setMenuOpen(false)} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
