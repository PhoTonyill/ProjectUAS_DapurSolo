import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../AdminContext';

/** Mengarahkan ke halaman login jika admin belum masuk. */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
}
