import { Link } from 'react-router-dom';
import { Alert, Col, Row } from 'react-bootstrap';
import { ORDER_STATUS, useAdmin } from '../AdminContext';
import PageHeader from '../components/PageHeader';

export default function DashboardHome() {
  const { menus, gallery, categories, orders } = useAdmin();
  const pending = orders.filter((o) => o.status === ORDER_STATUS.PENDING).length;

  const stats = [
    { icon: '🧾', value: pending, label: 'Pesanan belum selesai' },
    { icon: '🍽️', value: menus.length, label: 'Item menu' },
    { icon: '🏷️', value: categories.length, label: 'Kategori' },
    { icon: '🖼️', value: gallery.length, label: 'Foto galeri' },
  ];

  const shortcuts = [
    { to: '/admin/pesanan', title: 'Lihat pesanan', text: 'Pantau pesanan pembeli dan tandai yang sudah selesai.' },
    { to: '/admin/menu', title: 'Kelola menu', text: 'Tambah, ubah harga, atau hapus hidangan.' },
    { to: '/admin/kategori', title: 'Kelola kategori', text: 'Tambah kategori menu sesuai kebutuhan.' },
    { to: '/admin/galeri', title: 'Kelola galeri', text: 'Unggah foto baru atau hapus yang lama.' },
    { to: '/admin/tentang', title: 'Edit "Tentang Kami"', text: 'Perbarui cerita, alamat, dan kontak.' },
  ];

  return (
    <>
      <PageHeader
        title="Selamat datang 👋"
        subtitle="Kelola konten Restoran Pria Solo dari satu tempat."
      />

      <Alert variant="light" className="admin-info">
        <strong>Mode demo:</strong> menu, kategori, dan pesanan disimpan di localStorage
        browser ini (tidak ada server). Galeri dan "Tentang Kami" masih kembali ke data
        awal saat halaman dimuat ulang.
      </Alert>

      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col xs={12} sm={6} lg={3} key={s.label}>
            <div className="admin-card admin-stat">
              <div className="admin-stat-icon" aria-hidden="true">
                {s.icon}
              </div>
              <div>
                <div className="admin-stat-value">{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <h2 className="admin-section-title">Pintasan</h2>
      <Row className="g-3">
        {shortcuts.map((s) => (
          <Col xs={12} md={6} lg={4} key={s.to}>
            <Link to={s.to} className="admin-card admin-shortcut">
              <span className="admin-shortcut-title">{s.title}</span>
              <span className="admin-shortcut-text">{s.text}</span>
              <span className="admin-shortcut-go" aria-hidden="true">
                Buka →
              </span>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}
