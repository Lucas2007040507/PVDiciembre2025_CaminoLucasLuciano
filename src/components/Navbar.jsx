import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  // Si no hay usuario logueado, cortamos aquí y no mostramos nada.
  if (!user) return null;

  return (
    // <nav>: Es la caja contenedora de toda la barra blanca.
    // Usa la clase "nav" del index.css para fijarse arriba y tener sombra.
    <nav className="nav">
      
      {/* CAJA 1: IZQUIERDA (Botón Inicio) */}
      <div className="nav-left">
        {/* Link: Es un enlace inteligente. Te lleva a "/dashboard" sin recargar la página */}
        <Link to="/dashboard" className="link-inicio">
          ← Inicio
        </Link>
      </div>

      {/* CAJA 2: CENTRO (Logo) */}
      <div className="nav-center">
        {/* span: Es solo texto. Usa la clase "nav-logo" para verse azul y grande */}
        <span className="nav-logo">
          Clínica Lukk
        </span>
      </div>

      {/* CAJA 3: DERECHA (Botón Salir) */}
      <div className="nav-right">
        {/* button: Botón rojo. 
            onClick={logout}: Al hacer clic, dispara la función de cerrar sesión */}
        <button className="btn-logout" onClick={logout}>
          Salir
        </button>
      </div>

    </nav>
  );
}