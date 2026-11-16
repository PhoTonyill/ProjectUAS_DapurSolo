import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAdmin } from '../AdminContext';
import useNotice from '../hooks/useNotice';
import PageHeader from '../components/PageHeader';
import Notice from '../components/Notice';

const FIELDS = ['story', 'address', 'instagram', 'tiktok', 'phone', 'email'];

const toForm = (about) =>
  FIELDS.reduce((acc, key) => ({ ...acc, [key]: about[key] || '' }), {});

// "@restoranpriasolo " -> "restoranpriasolo"
const cleanHandle = (value) => value.trim().replace(/^@+/, '');

function validate(form) {
  const errors = {};
  if (!form.story.trim()) errors.story = 'Cerita restoran tidak boleh kosong.';
  if (!form.address.trim()) errors.address = 'Alamat wajib diisi.';
  ['instagram', 'tiktok'].forEach((key) => {
    if (/[\s/]/.test(cleanHandle(form[key]))) {
      errors[key] = 'Isi username saja, tanpa spasi atau tautan.';
    }
  });
  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = 'Format email tidak valid.';
  }
  return errors;
}

export default function AboutEditor() {
  const { about, saveAbout } = useAdmin();
  const { notice, show: flash, hide } = useNotice();
  const [form, setForm] = useState(() => toForm(about));
  const [errors, setErrors] = useState({});

  const dirty = JSON.stringify(form) !== JSON.stringify(toForm(about));

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const clean = {
      story: form.story.trim(),
      address: form.address.trim(),
      instagram: cleanHandle(form.instagram),
      tiktok: cleanHandle(form.tiktok),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };
    saveAbout(clean);
    setForm(clean);
    flash('Halaman "Tentang Kami" berhasil disimpan.');
  };

  const handleReset = () => {
    setForm(toForm(about));
    setErrors({});
  };

  const paragraphs = form.story.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <>
      <PageHeader
        title='Edit "Tentang Kami"'
        subtitle="Ubah cerita, alamat, dan informasi kontak restoran."
      />

      <Notice notice={notice} onClose={hide} />

      <Row className="g-4">
        <Col xs={12} xl={7}>
          <Form onSubmit={handleSubmit} noValidate className="admin-card admin-card-pad">
            <Form.Group className="mb-3" controlId="about-story">
              <Form.Label>
                Cerita kami <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={form.story}
                onChange={setField('story')}
                isInvalid={Boolean(errors.story)}
                placeholder="Tulis sejarah dan cerita restoran. Pisahkan paragraf dengan satu baris kosong."
              />
              <Form.Control.Feedback type="invalid">{errors.story}</Form.Control.Feedback>
              <Form.Text muted>
                {form.story.length} karakter. Pisahkan paragraf dengan satu baris kosong.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="about-address">
              <Form.Label>
                Alamat <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.address}
                onChange={setField('address')}
                isInvalid={Boolean(errors.address)}
              />
              <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              <Form.Text muted>Setiap baris baru akan tampil sebagai baris baru.</Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="about-instagram">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    value={form.instagram}
                    onChange={setField('instagram')}
                    isInvalid={Boolean(errors.instagram)}
                    placeholder="restoranpriasolo"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.instagram}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="about-tiktok">
                  <Form.Label>TikTok</Form.Label>
                  <Form.Control
                    value={form.tiktok}
                    onChange={setField('tiktok')}
                    isInvalid={Boolean(errors.tiktok)}
                    placeholder="restoranpriasolo"
                  />
                  <Form.Control.Feedback type="invalid">{errors.tiktok}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="about-phone">
                  <Form.Label>Telepon / WhatsApp (opsional)</Form.Label>
                  <Form.Control type="tel" value={form.phone} onChange={setField('phone')} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4" controlId="about-email">
                  <Form.Label>Email (opsional)</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={setField('email')}
                    isInvalid={Boolean(errors.email)}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" variant="resto" disabled={!dirty}>
                Simpan Perubahan
              </Button>
              <Button
                type="button"
                variant="outline-resto"
                onClick={handleReset}
                disabled={!dirty}
              >
                Batalkan perubahan
              </Button>
            </div>
            {dirty && <p className="admin-dirty-note">Ada perubahan yang belum disimpan.</p>}
          </Form>
        </Col>

        <Col xs={12} xl={5}>
          <aside className="admin-card admin-card-pad admin-preview" aria-label="Pratinjau">
            <div className="admin-preview-label">Pratinjau</div>
            <h2 className="admin-preview-title">Tentang Restoran Kami</h2>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="text-muted">Belum ada cerita.</p>
            )}
            <hr />
            <dl className="admin-preview-contact">
              <dt>Alamat</dt>
              <dd>{form.address || '—'}</dd>
              <dt>Instagram</dt>
              <dd>{cleanHandle(form.instagram) ? `@${cleanHandle(form.instagram)}` : '—'}</dd>
              <dt>TikTok</dt>
              <dd>{cleanHandle(form.tiktok) ? `@${cleanHandle(form.tiktok)}` : '—'}</dd>
              <dt>Telepon</dt>
              <dd>{form.phone || '—'}</dd>
              <dt>Email</dt>
              <dd>{form.email || '—'}</dd>
            </dl>
          </aside>
        </Col>
      </Row>
    </>
  );
}
