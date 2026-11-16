import { Navigate, Route, Routes } from 'react-router-dom';
import './admin.css';
import ProtectedRoute from './layout/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import DashboardHome from './pages/DashboardHome';
import MenuManager from './pages/MenuManager';
import CategoryManager from './pages/CategoryManager';
import OrderManager from './pages/OrderManager';
import GalleryManager from './pages/GalleryManager';
import AboutEditor from './pages/AboutEditor';

/**
 * Pasang di router utama sebagai: <Route path="/admin/*" element={<AdminApp />} />
 * Pastikan berada di dalam <AdminProvider>.
 */
export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="pesanan" element={<OrderManager />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="kategori" element={<CategoryManager />} />
        <Route path="galeri" element={<GalleryManager />} />
        <Route path="tentang" element={<AboutEditor />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
