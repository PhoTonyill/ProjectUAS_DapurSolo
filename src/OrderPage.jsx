import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import './OrderPage.css';
import { useAdmin } from './admin/AdminContext.jsx';
import { formatRupiah } from './cartUtils.js';

export default function OrderPage({ cart, onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { menus } = useAdmin();
  const item = menus.find((menu) => menu.id === id);
  const [quantity, setQuantity] = useState(1);

  // Alamat /menu/xxx yang tidak ada di data -> kembali ke daftar menu
  if (!item) return <Navigate to="/menu" replace />;

  const inCartQty = cart[item.id] || 0;

  const updateQuantity = (value) => {
    const parsedValue = Number(value);
    if (Number.isInteger(parsedValue) && parsedValue >= 1) {
      setQuantity(parsedValue);
    } else if (value === '') {
      setQuantity('');
    }
  };

  const saveOrder = (event) => {
    event.preventDefault();
    const orderQuantity = Number(quantity);
    if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
      setQuantity(1);
      return;
    }
    // Masukkan ke keranjang (di App), lalu buka halaman Pesanan
    onSave(item, orderQuantity);
    navigate('/pesanan', { state: { added: item.name } });
  };

  return (
    <div className="order-page">
      <Button as={Link} to="/menu" className="btn-outline-resto mb-4">
        ← Kembali ke menu
      </Button>

      <Row className="g-4">
        <Col md={6}>
          <Card className="order-image-wrap">
            <Card.Img src={item.image} alt={item.name} className="order-image" />
          </Card>
        </Col>

        <Col md={6} className="order-details">
          <p className="order-eyebrow">PESANAN ANDA</p>
          <h1 id="order-title">{item.name}</h1>
          <p className="order-price">{formatRupiah(item.price)}</p>
          <p className="order-description">{item.description}</p>

          <h2 className="order-heading">Isi makanan</h2>
          <Row xs={1} sm={2} className="g-2 mb-4">
            {(item.ingredients || []).map((ingredient) => (
              <Col key={ingredient}>
                <div className="ingredient-item">{ingredient}</div>
              </Col>
            ))}
          </Row>

          <Alert variant="warning" className="allergen-note">
            <Alert.Heading as="h2" className="order-heading">
              Informasi alergi
            </Alert.Heading>
            <p className="mb-2">
              {item.allergens || 'Informasi alergen belum tersedia. Silakan tanyakan kepada restoran.'}
            </p>
            <small className="text-muted">
              Dapur kami juga mengolah bahan lain. Hubungi restoran jika Anda
              memiliki alergi berat.
            </small>
          </Alert>

          <Form onSubmit={saveOrder} className="mt-4">
            <Form.Label htmlFor="order-quantity" className="fw-bold">
              Jumlah pesanan
            </Form.Label>
            <Row className="g-3 align-items-center">
              <Col sm={6}>
                <InputGroup>
                  <Button
                    variant="outline-secondary"
                    aria-label="Kurangi jumlah"
                    onClick={() => setQuantity((current) => Math.max(1, Number(current) - 1))}
                  >
                    −
                  </Button>
                  <Form.Control
                    id="order-quantity"
                    type="number"
                    min="1"
                    step="1"
                    className="text-center"
                    value={quantity}
                    onChange={(event) => updateQuantity(event.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    aria-label="Tambah jumlah"
                    onClick={() => setQuantity((current) => (Number(current) || 0) + 1)}
                  >
                    +
                  </Button>
                </InputGroup>
              </Col>
              <Col sm={6}>
                <Button type="submit" className="btn-resto w-100">
                  Simpan pesanan
                </Button>
              </Col>
            </Row>
          </Form>

          {inCartQty > 0 && (
            <Alert variant="success" className="mt-3 mb-0" role="status">
              Menu ini sudah ada di pesanan Anda ({inCartQty} porsi). Jumlah baru
              akan ditambahkan.
            </Alert>
          )}
        </Col>
      </Row>
    </div>
  );
}
