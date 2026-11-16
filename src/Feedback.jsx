import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import './Feedback.css';

const TOPICS = ['Rasa makanan', 'Pelayanan staf', 'Kebersihan', 'Kecepatan penyajian', 'Harga', 'Lainnya'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: '', email: '', topic: '', rating: '', message: '' };

export default function Feedback() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    // Hapus pesan error field ini saat pengguna mulai memperbaiki
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Nama wajib diisi.';
    if (!form.email.trim()) next.email = 'Email wajib diisi.';
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Format email belum benar.';
    if (!form.topic) next.topic = 'Pilih salah satu topik.';
    if (!form.rating) next.rating = 'Berikan penilaian Anda.';
    if (form.message.trim().length < 10) next.message = 'Masukan minimal 10 karakter.';
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // Tidak ada penyimpanan: semua kolom langsung dikosongkan kembali
    setForm(EMPTY_FORM);
  };

  return (
    <Card className="feedback-box">
      <Card.Body>
        <h3>Beri Masukan Layanan</h3>
        <p className="feedback-intro">
          Bantu kami menjadi lebih baik. Ceritakan pengalaman Anda di Restoran Pria Solo.
        </p>

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="fb-name">
            <Form.Label>Nama</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama Anda"
              isInvalid={Boolean(errors.name)}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="fb-email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              isInvalid={Boolean(errors.email)}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="fb-topic">
            <Form.Label>Topik masukan</Form.Label>
            <Form.Select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              isInvalid={Boolean(errors.topic)}
            >
              <option value="">-- Pilih topik --</option>
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.topic}</Form.Control.Feedback>
          </Form.Group>

          <fieldset className="mb-3">
            <legend className="form-label fs-6">Penilaian</legend>
            {[1, 2, 3, 4, 5].map((value) => (
              <Form.Check
                inline
                key={value}
                type="radio"
                id={`fb-rating-${value}`}
                name="rating"
                value={value}
                label={`${value} ★`}
                checked={form.rating === String(value)}
                onChange={handleChange}
                isInvalid={Boolean(errors.rating)}
              />
            ))}
            {errors.rating && (
              <div className="invalid-feedback d-block">{errors.rating}</div>
            )}
          </fieldset>

          <Form.Group className="mb-4" controlId="fb-message">
            <Form.Label>Masukan Anda</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tulis saran, kritik, atau pujian Anda di sini..."
              isInvalid={Boolean(errors.message)}
            />
            <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="btn-resto w-100">
            Kirim Masukan
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
