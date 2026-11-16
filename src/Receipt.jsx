import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Receipt.css';
import { ORDER_STATUS, useAdmin } from './admin/AdminContext.jsx';
import { formatDateTime } from './admin/utils.js';
import { formatRupiah } from './cartUtils.js';

/** Struk pesanan. Data dibaca dari localStorage (lewat AdminContext), jadi tetap ada setelah refresh. */
export default function Receipt() {
  const { id } = useParams();
  const { orders } = useAdmin();
  const order = orders.find((o) => o.id === id);

  // Nomor pesanan tidak ditemukan (mis. data dihapus / browser lain) -> kembali ke halaman Pesanan
  if (!order) return <Navigate to="/pesanan" replace />;

  const done = order.status === ORDER_STATUS.DONE;

  return (
    <div className="receipt-page">
      <p className="receipt-thanks no-print" role="status">
        Terima kasih, <strong>{order.customer.name}</strong>! Pesanan Anda sudah kami terima.
      </p>

      <article className="receipt" aria-label={`Struk pesanan ${order.id}`}>
        <div className="receipt-brand">
          <div className="receipt-name">Restoran Pria Solo</div>
          <div className="receipt-tagline">Rasanya susah dilawan!</div>
        </div>

        <hr className="receipt-rule" />

        <dl className="receipt-meta">
          <dt>No. pesanan</dt>
          <dd className="receipt-id">{order.id}</dd>
          <dt>Tanggal</dt>
          <dd>{formatDateTime(order.createdAt)}</dd>
          <dt>Nama</dt>
          <dd>{order.customer.name}</dd>
          <dt>No. telepon</dt>
          <dd>{order.customer.phone}</dd>
          <dt>Metode</dt>
          <dd>{order.method}</dd>
        </dl>

        <hr className="receipt-rule" />

        <ul className="receipt-items">
          {order.items.map((item) => (
            <li key={item.id}>
              <div className="receipt-item-name">{item.name}</div>
              <div className="receipt-item-line">
                <span>
                  {item.qty} × {formatRupiah(item.price)}
                </span>
                <span>{formatRupiah(item.price * item.qty)}</span>
              </div>
            </li>
          ))}
        </ul>

        <hr className="receipt-rule" />

        <div className="receipt-total-row">
          <span>Total item</span>
          <span>{order.totalItems} porsi</span>
        </div>
        <div className="receipt-total-row receipt-grand">
          <span>TOTAL</span>
          <span>{formatRupiah(order.total)}</span>
        </div>

        <hr className="receipt-rule" />

        <div className="receipt-status-row">
          <span>Status</span>
          <span className={`receipt-status ${done ? 'is-done' : 'is-pending'}`}>
            {done ? 'Selesai' : 'Sedang diproses'}
          </span>
        </div>

        <p className="receipt-foot">
          Tunjukkan nomor pesanan ini kepada kasir.
          <br />
          Terima kasih atas kunjungan Anda!
        </p>
      </article>

      <div className="receipt-actions no-print">
        <Button className="btn-resto" onClick={() => window.print()}>
          Cetak / simpan PDF
        </Button>
        <Button as={Link} to="/menu" className="btn-outline-resto">
          Pesan lagi
        </Button>
      </div>
    </div>
  );
}
