import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; 
import Navbar from './components/Navbar'; // Usamos el Navbar del componente

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReservarTurno from './pages/ReservarTurno';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reservar" 
          element={
            <ProtectedRoute>
              <ReservarTurno />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;