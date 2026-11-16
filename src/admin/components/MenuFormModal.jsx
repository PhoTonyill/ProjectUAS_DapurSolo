import { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { useAdmin } from '../AdminContext';
import ImageInput from './ImageInput';

const EMPTY = {
  name: '',
  category: '',
  price: '',
  description: '',
  ingredients: '',
  allergens: '',
  image: '',
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Nama menu wajib diisi.';
  if (!form.category) errors.category = 'Pilih kategori (tambah dulu di menu Kategori bila belum ada).';
  const price = Number(form.price);
  if (form.price === '' || Number.isNaN(price) || price < 0) {
    errors.price = 'Masukkan harga yang valid (angka, minimal 0).';
  }
  if (!form.image.trim()) errors.image = 'Foto menu wajib diisi.';
  return errors;
}

/** Modal untuk tambah (initial = null) maupun edit menu. */
export default function MenuFormModal({ show, onHide, onSubmit, initial }) {
  const { categories } = useAdmin();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setForm(
      initial
        ? {
            name: initial.name,
            category: initial.category,
            price: String(initial.price),
            description: initial.description || '',
            ingredients: (initial.ingredients || []).join('\n'),
            allergens: initial.allergens || '',
            image: initial.image || '',
          }
        : { ...EMPTY, category: categories[0] || '' }
    );
    // categories sengaja tidak jadi dependensi: form tidak boleh ter-reset saat daftar berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, initial]);

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      ingredients: form.ingredients
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      allergens: form.allergens.trim(),
      image: form.image.trim(),
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      scrollable
      className="admin-modal"
    >
      <Form onSubmit={handleSubmit} noValidate className="d-flex flex-column overflow-hidden">
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="fs-5">
            {isEdit ? 'Edit Menu' : 'Tambah Menu Baru'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3" controlId="menu-name">
                <Form.Label>
                  Nama menu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={setField('name')}
                  isInvalid={Boolean(errors.name)}
                  placeholder="Contoh: Nasi Liwet Solo"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="menu-category">
                <Form.Label>
                  Kategori <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={form.category}
                  onChange={setField('category')}
                  isInvalid={Boolean(errors.category)}
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="menu-price">
            <Form.Label>
              Harga <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text>Rp</InputGroup.Text>
              <Form.Control
                type="number"
                min="0"
                step="500"
                inputMode="numeric"
                value={form.price}
                onChange={setField('price')}
                isInvalid={Boolean(errors.price)}
                placeholder="25000"
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="menu-description">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={setField('description')}
              placeholder="Ceritakan singkat tentang hidangan ini"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="menu-ingredients">
                <Form.Label>Isi / bahan</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.ingredients}
                  onChange={setField('ingredients')}
                  placeholder={'Satu bahan per baris, mis.:\nNasi santan\nSuwiran ayam'}
                />
                <Form.Text muted>Tampil di halaman detail pesanan.</Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="menu-allergens">
                <Form.Label>Informasi alergen</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.allergens}
                  onChange={setField('allergens')}
                  placeholder="Contoh: Mengandung telur dan santan."
                />
                <Form.Text muted>Isi dengan teliti demi keamanan pelanggan.</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <ImageInput
            label="Foto menu"
            required
            value={form.image}
            error={errors.image}
            onChange={(image) => {
              setForm((prev) => ({ ...prev, image }));
              setErrors((prev) => ({ ...prev, image: undefined }));
            }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="outline-resto" onClick={onHide}>
            Batal
          </Button>
          <Button type="submit" variant="resto">
            {isEdit ? 'Simpan Perubahan' : 'Tambah Menu'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
