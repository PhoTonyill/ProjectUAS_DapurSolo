import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, ListGroup, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import './Cart.css';
import { parsePrice, formatRupiah } from './cartUtils.js';
import { isValidPhone } from './admin/utils.js';

const METHODS = ['Makan di Tempat', 'Bawa Pulang'];

export default function Cart({ lines, onChangeQty, onRemove, onClear, onCheckout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState(METHODS[0]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [showAdded, setShowAdded] = useState(true);

  // Nama menu yang baru ditambahkan dikirim dari halaman detail lewat location.state
  const addedName = location.state?.added;

  const totalItems = lines.reduce((sum, line) => sum + line.qty, 0);
  const totalPrice = lines.reduce(
    (sum, line) => sum + parsePrice(line.item.price) * line.qty,
    0,
  );

  const setField = (field) => (e) => {
    setCustomer((current) => ({ ...current, [field]: e.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    const found = {};
    if (customer.name.trim().length < 2) found.name = 'Nama wajib diisi (minimal 2 huruf).';
    if (!customer.phone.trim()) found.phone = 'Nomor telepon wajib diisi.';
    else if (!isValidPhone(customer.phone)) {
      found.phone = 'Nomor tidak valid. Contoh: 081234567890 atau +6281234567890.';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Simpan pesanan (ke localStorage lewat App) lalu tampilkan struk
    const order = onCheckout({ customer, method });
    navigate(`/struk/${order.id}`, { replace: true });
  };

  return (
    <div className="cart-section">
      <h2>Pesanan Anda</h2>

      {addedName && showAdded && lines.length > 0 && (
        <Alert variant="success" dismissible onClose={() => setShowAdded(false)} role="status">
          <strong>{addedName}</strong> ditambahkan ke pesanan Anda.
        </Alert>
      )}

      {lines.length === 0 ? (
        <Card body className="cart-empty text-center">
          <p className="mb-3">
            Belum ada pesanan. Pilih menu terlebih dahulu.
          </p>
          <div>
            <Button as={Link} to="/menu" className="btn-resto">
              Lihat menu
            </Button>
          </div>
        </Card>
      ) : (
        <Row className="g-4 text-start">
          <Col lg={8}>
            <Card className="cart-card">
              <Card.Header className="d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Daftar Pesanan</h3>
                <Button variant="outline-danger" size="sm" onClick={onClear}>
                  Kosongkan
                </Button>
              </Card.Header>

              <ListGroup variant="flush">
                {lines.map(({ item, qty }) => {
                  const unit = parsePrice(item.price);
                  return (
                    <ListGroup.Item
                      key={item.id}
                      className="d-flex flex-wrap align-items-center gap-3 py-3"
                    >
                      <img className="cart-thumb" src={item.image} alt={item.name} />

                      <div className="flex-grow-1">
                        <div className="fw-bold">{item.name}</div>
                        <small className="text-muted">{formatRupiah(unit)} / porsi</small>
                      </div>

                      <InputGroup size="sm" className="cart-qty">
                        <Button
                          variant="outline-secondary"
                          aria-label={`Kurangi ${item.name}`}
                          onClick={() => onChangeQty(item.id, qty - 1)}
                        >
                          −
                        </Button>
                        <InputGroup.Text className="cart-qty-value" aria-live="polite">
                          {qty}
                        </InputGroup.Text>
                        <Button
                          variant="outline-secondary"
                          aria-label={`Tambah ${item.name}`}
                          onClick={() => onChangeQty(item.id, qty + 1)}
                        >
                          +
                        </Button>
                      </InputGroup>

                      <div className="cart-line-total text-end">
                        <div className="fw-bold">{formatRupiah(unit * qty)}</div>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0"
                          onClick={() => onRemove(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="cart-card" as="aside" aria-label="Ringkasan pesanan">
              <Card.Header>
                <h3 className="mb-0">Ringkasan Pesanan</h3>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled mb-3 pb-3 border-bottom">
                  {lines.map(({ item, qty }) => (
                    <li key={item.id} className="d-flex justify-content-between gap-2 py-1">
                      <span>
                        {item.name} × {qty}
                      </span>
                      <span>{formatRupiah(parsePrice(item.price) * qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Total item</span>
                  <span>{totalItems} porsi</span>
                </div>
                <Form id="checkout-form" onSubmit={handleCheckout} noValidate>
                <Form.Group controlId="cart-name" className="mb-3">
                  <Form.Label className="mb-1">
                    Nama pemesan <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    value={customer.name}
                    onChange={setField('name')}
                    isInvalid={Boolean(errors.name)}
                    maxLength={60}
                    autoComplete="name"
                    placeholder="Nama lengkap"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="cart-phone" className="mb-3">
                  <Form.Label className="mb-1">
                    Nomor telepon <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="tel"
                    inputMode="tel"
                    value={customer.phone}
                    onChange={setField('phone')}
                    isInvalid={Boolean(errors.phone)}
                    maxLength={20}
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                  />
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="cart-method"
                  className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
                >
                  <Form.Label className="mb-0 text-muted">Metode</Form.Label>
                  <Form.Select
                    size="sm"
                    className="cart-method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    {METHODS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="cart-total d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <Button type="submit" className="btn-resto w-100">
                  Pesan Sekarang
                </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
