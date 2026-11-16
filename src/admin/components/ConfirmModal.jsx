import { Button, Modal } from 'react-bootstrap';

export default function ConfirmModal({
  show,
  title = 'Konfirmasi',
  children,
  confirmLabel = 'Hapus',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="fs-5">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-resto" onClick={onCancel}>
          Batal
        </Button>
        <Button variant="resto" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
