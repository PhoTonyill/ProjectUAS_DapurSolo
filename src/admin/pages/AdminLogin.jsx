import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { DEMO_CREDENTIALS, useAdmin } from '../AdminContext';

export default function AdminLogin() {
  const { isAuthenticated, login } = useAdmin();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = (location.state && location.state.from && location.state.from.pathname) || '/admin';

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Username dan kata sandi wajib diisi.');
      return;
    }
    if (!login(username, password)) {
      setError('Username atau kata sandi salah.');
    }
  };

  return (
    <div className="admin-root admin-login">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-mark admin-brand-mark-lg" aria-hidden="true">
            PS
          </span>
          <h1 className="admin-login-title">Masuk Admin</h1>
          <p className="admin-login-subtitle">Restoran Pria Solo</p>
        </div>

        {error && (
          <Alert variant="danger" className="py-2" role="alert">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="login-username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              autoComplete="username"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="login-password">
            <Form.Label>Kata sandi</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="outline-resto"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="resto" className="w-100">
            Masuk
          </Button>
        </Form>

        {/* Hapus blok ini saat tidak lagi mode demo */}
        <p className="admin-login-hint">
          Demo: <code>{DEMO_CREDENTIALS.username}</code> / <code>{DEMO_CREDENTIALS.password}</code>
        </p>

        <div className="text-center mt-3">
          <Link to="/" className="admin-link">
            ← Kembali ke situs
          </Link>
        </div>
      </div>
    </div>
  );
}
