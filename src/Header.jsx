import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { useAdmin } from './admin/AdminContext.jsx';
import { categoryAnchor } from './admin/utils.js';

// Menentukan menu yang aktif dan pesan status dari alamat halaman saat ini
function getNavState(pathname, hash, menuCategories) {
  if (pathname === '/') {
    if (hash === '#Cerita') {
      return { active: 'Cerita Kami', message: 'Anda sedang melihat cerita Restoran Pria Solo.' };
    }
    if (hash === '#Kontak') {
      return { active: 'Kontak', message: 'Anda sedang melihat informasi kontak kami.' };
    }
    return { active: 'Home', message: 'Selamat datang di Restoran Pria Solo.' };
  }

  if (pathname === '/menu') {
    const category = menuCategories.find((c) => c.hash === hash);
    return {
      active: 'Menu',
      message: category
        ? `Anda sedang melihat kategori ${category.label}.`
        : 'Pilih hidangan favorit Anda untuk mulai memesan.',
    };
  }

  if (pathname.startsWith('/menu/')) {
    return { active: 'Menu', message: 'Pilih jumlah pesanan, lalu simpan ke daftar pesanan Anda.' };
  }

  if (pathname.startsWith('/struk/')) {
    return { active: 'Pesanan', message: 'Struk pesanan Anda. Simpan atau tunjukkan nomor pesanan ke kasir.' };
  }

  if (pathname === '/pesanan') {
    return { active: 'Pesanan', message: 'Anda sedang melihat daftar pesanan Anda.' };
  }

  return { active: '', message: '' };
}

export default function Header({ cartCount }) {
  const { pathname, hash } = useLocation();
  const [expanded, setExpanded] = useState(false); // buka/tutup menu di layar kecil
  const { menus, categories } = useAdmin();
  // Dropdown kategori mengikuti data admin; kategori yang belum punya menu disembunyikan
  const menuCategories = useMemo(
    () =>
      categories
        .filter((name) => menus.some((m) => m.category === name))
        .map((name) => ({ label: name, hash: `#${categoryAnchor(name)}` })),
    [categories, menus]
  );
  const { active, message } = getNavState(pathname, hash, menuCategories);
  const close = () => setExpanded(false);

  return (
    <>
      <header>
        <div className="brand-area">
          <img src="/ProjectUAS_DapurSolo/Gambar/Jokowi Makan.png" alt="Logo Restoran" />
          <h1 className="menu-title">Restoran Pria Solo</h1>
          <div className="brand-title">RASANYA SUSAH DILAWAN!</div>
        </div>

        <Navbar expand="md" className="p-0" expanded={expanded} onToggle={setExpanded}>
          <Navbar.Toggle aria-controls="main-nav" className="nav-toggler" />
          <Navbar.Collapse id="main-nav">
            <Nav className="mx-auto align-items-md-center">
              <Nav.Link as={Link} to="/" active={active === 'Home'} onClick={close}>
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={{ pathname: '/', hash: '#Cerita' }}
                active={active === 'Cerita Kami'}
                onClick={close}
              >

                Cerita Kami
              </Nav.Link>
              <Nav.Link as={Link} to="/admin" onClick={close}>
                Admin
              </Nav.Link>
              <NavDropdown title="Menu" id="menu-dropdown" active={active === 'Menu'}>
                <NavDropdown.Item as={Link} to="/menu" onClick={close}>
                  Semua menu
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {menuCategories.map((category) => (
                  <NavDropdown.Item
                    key={category.hash}
                    as={Link}
                    to={{ pathname: '/menu', hash: category.hash }}
                    onClick={close}
                  >
                    {category.label}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <Nav.Link as={Link} to="/pesanan" active={active === 'Pesanan'} onClick={close}>
                Pesanan
                {cartCount > 0 && (
                  <Badge pill className="badge-resto ms-2">
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={{ pathname: '/', hash: '#Kontak' }}
                active={active === 'Kontak'}
                onClick={close}
              >
                Kontak
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>

      {message && (
        <p className="nav-feedback" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </>
  );
}
