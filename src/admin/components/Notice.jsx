import { Alert } from 'react-bootstrap';

export default function Notice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <Alert
      variant={notice.variant}
      dismissible
      onClose={onClose}
      className="admin-alert"
      role="status"
    >
      {notice.message}
    </Alert>
  );
}
