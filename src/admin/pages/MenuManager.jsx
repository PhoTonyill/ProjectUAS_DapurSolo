import { useMemo, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useAdmin } from '../AdminContext';
import { formatRupiah } from '../utils';
import useNotice from '../hooks/useNotice';
import PageHeader from '../components/PageHeader';
import Notice from '../components/Notice';
import ConfirmModal from '../components/ConfirmModal';
import MenuFormModal from '../components/MenuFormModal';

export default function MenuManager() {
  const { menus, categories, addMenu, updateMenu, deleteMenu } = useAdmin();
  const { notice, show: flash, hide } = useNotice();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus.filter((m) => {
      const matchCategory = category === 'Semua' || m.category === category;
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [menus, query, category]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSubmit = (data) => {
    if (editing) {
      updateMenu(editing.id, data);
      flash(`Menu "${data.name}" berhasil diperbarui.`);
    } else {
      addMenu(data);
      flash(`Menu "${data.name}" berhasil ditambahkan.`);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    deleteMenu(toDelete.id);
    flash(`Menu "${toDelete.name}" telah dihapus.`);
    setToDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Manajemen Menu"
        subtitle="Daftar makanan dan minuman yang tampil di situs."
        actions={
          <Button variant="resto" onClick={openAdd}>
            + Tambah Menu Baru
          </Button>
        }
      />

      <Notice notice={notice} onClose={hide} />

      <div className="admin-card">
        <div className="admin-toolbar">
          <Row className="g-2 align-items-center">
            <Col xs={12} md={7}>
              <Form.Control
                type="search"
                placeholder="Cari nama atau deskripsi menu…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Cari menu"
              />
            </Col>
            <Col xs={12} md={5}>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter kategori"
              >
                <option value="Semua">Semua kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon" aria-hidden="true">
              🍽️
            </div>
            <p className="mb-2">
              {menus.length === 0
                ? 'Belum ada menu. Mulai dengan menambahkan hidangan pertama.'
                : 'Tidak ada menu yang cocok dengan pencarian.'}
            </p>
            {menus.length === 0 && (
              <Button variant="resto" size="sm" onClick={openAdd}>
                + Tambah Menu Baru
              </Button>
            )}
          </div>
        ) : (
          <Table responsive hover className="admin-table align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: 72 }}>Foto</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th className="d-none d-xl-table-cell">Deskripsi</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.image ? (
                      <img className="admin-thumb" src={m.image} alt={m.name} />
                    ) : (
                      <div className="admin-thumb admin-thumb-empty" aria-hidden="true">
                        🍽️
                      </div>
                    )}
                  </td>
                  <td className="fw-semibold">{m.name}</td>
                  <td>
                    <span className="admin-badge">{m.category}</span>
                  </td>
                  <td className="text-nowrap">{formatRupiah(m.price)}</td>
                  <td className="d-none d-xl-table-cell admin-desc">{m.description}</td>
                  <td className="text-end text-nowrap">
                    <Button
                      variant="outline-resto"
                      size="sm"
                      className="me-2"
                      onClick={() => openEdit(m)}
                      aria-label={`Edit ${m.name}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setToDelete(m)}
                      aria-label={`Hapus ${m.name}`}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {menus.length > 0 && (
          <div className="admin-table-footer">
            Menampilkan {filtered.length} dari {menus.length} menu
          </div>
        )}
      </div>

      <MenuFormModal
        show={formOpen}
        initial={editing}
        onHide={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={Boolean(toDelete)}
        title="Hapus menu?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        Menu <strong>{toDelete && toDelete.name}</strong> akan dihapus. Tindakan ini
        tidak dapat dibatalkan.
      </ConfirmModal>
    </>
  );
}
