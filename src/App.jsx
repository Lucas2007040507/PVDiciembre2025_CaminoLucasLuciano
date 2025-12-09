import { Routes, Route } from 'react-router-dom'; // Herramientas para navegar
import { AuthProvider } from './context/AuthContext'; // El cerebro que maneja la sesión
import ProtectedRoute from './components/ProtectedRoute'; // El guardia de seguridad
import Navbar from './components/Navbar'; // La barra de arriba

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReservarTurno from './pages/ReservarTurno';

function App() {
  return (
    // 1. PROVEEDOR DE CONTEXTO:
    // Envuelve TODO para que cualquier parte de la app pueda acceder al usuario logueado.
    <AuthProvider>
      
      {/* 2. BARRA DE NAVEGACIÓN:
          Al ponerla fuera de <Routes>, se carga una vez y queda fija siempre. 
          (El propio componente Navbar decide si mostrarse o no). */}
      <Navbar />
      
      {/* 3. DEFINICIÓN DE RUTAS: Aquí decimos qué componente mostrar según la URL */}
      <Routes>
        
        {/* RUTA PÚBLICA: Cualquiera puede entrar aquí (Login/Registro) */}
        <Route path="/" element={<Login />} />

        {/* --- RUTAS PROTEGIDAS --- 
            Estas páginas están envueltas en <ProtectedRoute>.
            Si no estás logueado, el ProtectedRoute te expulsa al Login. 
        */}
        
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