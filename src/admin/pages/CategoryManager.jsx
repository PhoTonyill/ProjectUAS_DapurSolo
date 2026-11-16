import { useMemo, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { useAdmin } from '../AdminContext';
import useNotice from '../hooks/useNotice';
import PageHeader from '../components/PageHeader';
import Notice from '../components/Notice';
import ConfirmModal from '../components/ConfirmModal';

/** Modal kecil untuk mengubah nama kategori. */
function RenameModal({ category, onHide, onSubmit }) {
  const [value, setValue] = useState(category || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onSubmit(category, value);
    if (!result.ok) setError(result.error);
  };

  return (
    <Modal show={Boolean(category)} onHide={onHide} centered className="admin-modal">
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="fs-5">
            Ubah Nama Kategori
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="category-rename">
            <Form.Label>Nama kategori</Form.Label>
            <Form.Control
              value={value}
              maxLength={40}
              autoFocus
              isInvalid={Boolean(error)}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
            />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
            <Form.Text muted>Semua menu di kategori ini ikut memakai nama baru.</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="outline-resto" onClick={onHide}>
            Batal
          </Button>
          <Button type="submit" variant="resto">
            Simpan
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default function CategoryManager() {
  const { categories, menus, addCategory, renameCategory, deleteCategory } = useAdmin();
  const { notice, show: flash, hide } = useNotice();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  // jumlah menu per kategori
  const counts = useMemo(() => {
    const map = {};
    menus.forEach((m) => {
      map[m.category] = (map[m.category] || 0) + 1;
    });
    return map;
  }, [menus]);

  const handleAdd = (e) => {
    e.preventDefault();
    const result = addCategory(name);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    flash(`Kategori "${result.name}" berhasil ditambahkan.`);
    setName('');
    setError('');
  };

  const handleRename = (oldName, newName) => {
    const result = renameCategory(oldName, newName);
    if (result.ok) {
      flash(`Kategori "${oldName}" diganti menjadi "${result.name}".`);
      setRenaming(null);
    }
    return result;
  };

  const confirmDelete = () => {
    const result = deleteCategory(toDelete);
    flash(result.ok ? `Kategori "${toDelete}" telah dihapus.` : result.error, result.ok ? 'success' : 'danger');
    setToDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Kategori Menu"
        subtitle="Tambah kategori sendiri. Kategori yang ada langsung bisa dipilih saat menambah atau mengedit menu."
      />

      <Notice notice={notice} onClose={hide} />

      <div className="admin-card admin-card-pad mb-4">
        <Form onSubmit={handleAdd} noValidate>
          <Form.Label htmlFor="category-new">Tambah kategori baru</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="category-new"
              value={name}
              maxLength={40}
              placeholder="Contoh: Paket Hemat, Dessert, Jajanan Pasar"
              isInvalid={Boolean(error)}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
            />
            <Button type="submit" variant="resto">
              + Tambah Kategori
            </Button>
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </InputGroup>
        </Form>
      </div>

      <div className="admin-card">
        {categories.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon" aria-hidden="true">
              🏷️
            </div>
            <p className="mb-0">Belum ada kategori. Tambahkan yang pertama di atas.</p>
          </div>
        ) : (
          <Table responsive hover className="admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>Nama kategori</th>
                <th>Jumlah menu</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const used = counts[c] || 0;
                return (
                  <tr key={c}>
                    <td className="fw-semibold">{c}</td>
                    <td>{used} menu</td>
                    <td className="text-end text-nowrap">
                      <Button
                        variant="outline-resto"
                        size="sm"
                        className="me-2"
                        onClick={() => setRenaming(c)}
                        aria-label={`Ubah nama ${c}`}
                      >
                        Ubah nama
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        disabled={used > 0}
                        title={used > 0 ? 'Masih dipakai menu, tidak bisa dihapus' : undefined}
                        onClick={() => setToDelete(c)}
                        aria-label={`Hapus ${c}`}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <div className="admin-table-footer">
          Kategori yang masih dipakai menu tidak bisa dihapus.
        </div>
      </div>

      {renaming && (
        <RenameModal
          key={renaming}
          category={renaming}
          onHide={() => setRenaming(null)}
          onSubmit={handleRename}
        />
      )}

      <ConfirmModal
        show={Boolean(toDelete)}
        title="Hapus kategori?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        Kategori <strong>{toDelete}</strong> akan dihapus.
      </ConfirmModal>
    </>
  );
}
