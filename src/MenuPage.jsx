import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAdmin } from './admin/AdminContext.jsx';
import { formatRupiah } from './cartUtils.js';
import { categoryAnchor } from './admin/utils.js';

export default function MenuPage({ cart }) {
  const { menus, categories } = useAdmin();
  return (
    <section id="Menu" className="menu-picks-section">
      <h2>Pilihan Menu</h2>
      <p className="menu-picks-subtitle">Pilih hidangan favorit Anda untuk melihat detail dan mulai memesan.</p>
      {categories.map((category) => {
        const items = menus.filter((item) => item.category === category);
        if (!items.length) return null;
        return (
          <div key={category} id={categoryAnchor(category)} className="mb-5">
            <h3 className="mb-3">{category}</h3>
            <Row xs={1} sm={2} lg={4} className="menu-picks-grid g-3">
              {items.map((item) => (
                <Col key={item.id}>
                  <Card className="menu-pick-card h-100">
                    <Card.Img variant="top" src={item.image || '/Gambar/Makanan 1.png'} alt={item.name} />
                    <div className="menu-pick-content">
                      <div className="menu-pick-heading"><h3>{item.name}</h3><span>{formatRupiah(item.price)}</span></div>
                      <p>{item.description}</p>
                      {cart[item.id] > 0 && <Badge pill className="badge-ordered mb-2">Dipesan: {cart[item.id]} porsi</Badge>}
                      <Button as={Link} to={`/menu/${item.id}`} className="btn-resto w-100">{cart[item.id] > 0 ? 'Tambah lagi' : 'Mau pesan'}</Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        );
      })}
      {menus.length === 0 && <p className="text-center py-5">Belum ada menu yang tersedia.</p>}
    </section>
  );
}
