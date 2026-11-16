import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import { ORDER_STATUS, useAdmin } from '../AdminContext';
import { formatDateTime, formatRupiah } from '../utils';
import useNotice from '../hooks/useNotice';
import PageHeader from '../components/PageHeader';
import Notice from '../components/Notice';

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: ORDER_STATUS.PENDING, label: 'Belum selesai' },
  { key: ORDER_STATUS.DONE, label: 'Selesai' },
];

export default function OrderManager() {
  const { orders, setOrderStatus } = useAdmin();
  const { notice, show: flash, hide } = useNotice();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(
    () => ({
      all: orders.length,
      [ORDER_STATUS.PENDING]: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
      [ORDER_STATUS.DONE]: orders.filter((o) => o.status === ORDER_STATUS.DONE).length,
    }),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.replace(/[\s-]/g, '').includes(q.replace(/[\s-]/g, ''))
      );
    });
  }, [orders, filter, query]);

  const toggle = (order) => {
    const done = order.status !== ORDER_STATUS.DONE;
    setOrderStatus(order.id, done ? ORDER_STATUS.DONE : ORDER_STATUS.PENDING);
    flash(`Pesanan ${order.id} ditandai ${done ? 'selesai' : 'belum selesai'}.`);
  };

  return (
    <>
      <PageHeader
        title="Pesanan Masuk"
        subtitle="Riwayat pesanan dari pembeli. Tandai pesanan yang sudah selesai disiapkan."
      />

      <Notice notice={notice} onClose={hide} />

      <div className="admin-card mb-3">
        <div className="admin-toolbar border-0">
          <Row className="g-2 align-items-center">
            <Col xs={12} lg={6}>
              <ButtonGroup className="w-100" aria-label="Filter status pesanan">
                {FILTERS.map((f) => (
                  <Button
                    key={f.key}
                    variant={filter === f.key ? 'resto' : 'outline-resto'}
                    onClick={() => setFilter(f.key)}
                    aria-pressed={filter === f.key}
                  >
                    {f.label} ({counts[f.key]})
                  </Button>
                ))}
              </ButtonGroup>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Control
                type="search"
                placeholder="Cari nomor pesanan, nama, atau no. telepon…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Cari pesanan"
              />
            </Col>
          </Row>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon" aria-hidden="true">
              🧾
            </div>
            <p className="mb-0">
              {orders.length === 0
                ? 'Belum ada pesanan. Pesanan yang dibuat pembeli akan muncul di sini.'
                : 'Tidak ada pesanan yang cocok dengan filter atau pencarian.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-order-list">
          {filtered.map((o) => {
            const done = o.status === ORDER_STATUS.DONE;
            return (
              <article
                key={o.id}
                className={`admin-card admin-order${done ? ' is-done' : ''}`}
                aria-label={`Pesanan ${o.id}`}
              >
                <div className="admin-order-head">
                  <div>
                    <div className="admin-order-id">{o.id}</div>
                    <div className="admin-order-time">{formatDateTime(o.createdAt)}</div>
                  </div>
                  <span className={`admin-status ${done ? 'admin-status-done' : 'admin-status-pending'}`}>
                    {done ? 'Selesai' : 'Belum selesai'}
                  </span>
                </div>

                <dl className="admin-order-meta">
                  <div>
                    <dt>Pembeli</dt>
                    <dd>{o.customer.name}</dd>
                  </div>
                  <div>
                    <dt>No. telepon</dt>
                    <dd>
                      <a className="admin-link" href={`tel:${o.customer.phone.replace(/[\s-]/g, '')}`}>
                        {o.customer.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Metode</dt>
                    <dd>{o.method}</dd>
                  </div>
                </dl>

                <ul className="admin-order-items">
                  {o.items.map((i) => (
                    <li key={i.id}>
                      <span>
                        {i.name} × {i.qty}
                      </span>
                      <span>{formatRupiah(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="admin-order-foot">
                  <div className="admin-order-total">
                    <span>Total ({o.totalItems} porsi)</span>
                    <strong>{formatRupiah(o.total)}</strong>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      as={Link}
                      to={`/struk/${o.id}`}
                      target="_blank"
                      variant="outline-resto"
                      size="sm"
                    >
                      Lihat struk
                    </Button>
                    <Button
                      variant={done ? 'outline-resto' : 'resto'}
                      size="sm"
                      onClick={() => toggle(o)}
                    >
                      {done ? 'Tandai belum selesai' : '✓ Tandai selesai'}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
