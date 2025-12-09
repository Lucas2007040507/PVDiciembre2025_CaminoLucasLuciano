import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// SIN IMPORTAR CSS (Ya está en index.css)

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav className="nav">
      {/* 1. IZQUIERDA */}
      <div className="nav-left">
        <Link to="/dashboard" className="link-inicio">← Inicio</Link>
      </div>

      {/* 2. CENTRO */}
      <div className="nav-center">
        <span className="nav-logo">Clínica Lukk</span>
      </div>

      {/* 3. DERECHA */}
      <div className="nav-right">
        <span className="nav-user">Hola, {user.nombre}</span>
        <button className="btn-logout" onClick={logout}>Salir</button>
      </div>
    </nav>
  );
}