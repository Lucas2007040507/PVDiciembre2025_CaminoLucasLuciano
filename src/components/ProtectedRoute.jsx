import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Si no hay usuario logueado, redirigir al Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay usuario, mostrar la página solicitada (hija)
  return children;
}