import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useAdmin } from '../AdminContext';
import useNotice from '../hooks/useNotice';
import PageHeader from '../components/PageHeader';
import Notice from '../components/Notice';
import ConfirmModal from '../components/ConfirmModal';
import GalleryFormModal from '../components/GalleryFormModal';

export default function GalleryManager() {
  const { gallery, addPhoto, deletePhoto } = useAdmin();
  const { notice, show: flash, hide } = useNotice();

  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleAdd = (data) => {
    addPhoto(data);
    flash('Foto berhasil ditambahkan ke galeri.');
    setFormOpen(false);
  };

  const confirmDelete = () => {
    deletePhoto(toDelete.id);
    flash('Foto telah dihapus dari galeri.');
    setToDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Manajemen Galeri"
        subtitle={`${gallery.length} foto restoran saat ini.`}
        actions={
          <Button variant="resto" onClick={() => setFormOpen(true)}>
            + Tambah Foto
          </Button>
        }
      />

      <Notice notice={notice} onClose={hide} />

      {gallery.length === 0 ? (
        <div className="admin-card admin-empty">
          <div className="admin-empty-icon" aria-hidden="true">
            🖼️
          </div>
          <p className="mb-2">Galeri masih kosong. Tambahkan foto pertama restoran Anda.</p>
          <Button variant="resto" size="sm" onClick={() => setFormOpen(true)}>
            + Tambah Foto
          </Button>
        </div>
      ) : (
        <Row className="g-3">
          {gallery.map((photo) => (
            <Col xs={12} sm={6} lg={4} xxl={3} key={photo.id}>
              <figure className="admin-card admin-photo m-0">
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <figcaption>
                  <span className="admin-photo-title" title={photo.title}>
                    {photo.title}
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setToDelete(photo)}
                    aria-label={`Hapus foto ${photo.title}`}
                  >
                    Hapus
                  </Button>
                </figcaption>
              </figure>
            </Col>
          ))}
        </Row>
      )}

      <GalleryFormModal
        show={formOpen}
        onHide={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />

      <ConfirmModal
        show={Boolean(toDelete)}
        title="Hapus foto?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        Foto <strong>{toDelete && toDelete.title}</strong> akan dihapus dari galeri.
      </ConfirmModal>
    </>
  );
}
