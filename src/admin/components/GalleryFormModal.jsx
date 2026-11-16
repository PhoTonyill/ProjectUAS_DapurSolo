import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ImageInput from './ImageInput';

export default function GalleryFormModal({ show, onHide, onSubmit }) {
  const [title, setTitle] = useState('');
  const [src, setSrc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setTitle('');
      setSrc('');
      setError('');
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!src.trim()) {
      setError('Pilih file atau tempel URL foto terlebih dahulu.');
      return;
    }
    onSubmit({ title: title.trim() || 'Foto galeri', src: src.trim() });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      className="admin-modal"
    >
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="fs-5">
            Tambah Foto Galeri
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="gallery-title">
            <Form.Label>Keterangan foto</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Suasana makan siang"
              autoFocus
            />
          </Form.Group>

          <ImageInput
            label="Foto"
            required
            value={src}
            onChange={(value) => {
              setSrc(value);
              setError('');
            }}
            error={error}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="outline-resto" onClick={onHide}>
            Batal
          </Button>
          <Button type="submit" variant="resto">
            Tambah Foto
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
