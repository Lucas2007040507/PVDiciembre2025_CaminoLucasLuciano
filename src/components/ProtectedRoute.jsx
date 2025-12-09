import { Navigate } from 'react-router-dom'; // Importamos el componente para redirigir
import { useAuth } from '../context/AuthContext'; // Importamos el contexto para ver al usuario

// Este componente recibe "children", que son las páginas que queremos proteger (ej: Dashboard)
export default function ProtectedRoute({ children }) {
  // 1. VERIFICACIÓN: Pedimos al contexto el usuario actual
  const { user } = useAuth();

  // 2. SEGURIDAD: Si NO hay usuario (!user), es un intruso.
  if (!user) {
    // Lo redirigimos forzosamente a la página principal ("/") que es el Login.
    // "replace" borra el historial para que no pueda volver atrás con la flecha del navegador.
    return <Navigate to="/" replace />;
  }

  // 3. ACCESO CONCEDIDO: Si hay usuario, mostramos el contenido (la página hija).
  return children;
}