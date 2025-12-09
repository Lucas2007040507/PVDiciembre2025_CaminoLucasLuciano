import React from 'react'
import ReactDOM from 'react-dom/client' // La herramienta para pintar en el navegador
import { BrowserRouter } from 'react-router-dom' // Habilita el sistema de rutas
import App from './App.jsx' // Tu aplicación completa
import './index.css' // Importamos los ESTILOS GLOBALES (Barra, fondo, colores)

// 1. CONEXIÓN CON EL HTML:
// Buscamos el elemento <div id="root"> en el archivo index.html.
// React tomará control total de ese elemento.
ReactDOM.createRoot(document.getElementById('root')).render(
  
  // 2. MODO ESTRICTO:
  // Es una herramienta de desarrollo. Ayuda a encontrar errores comunes.
  // (A veces hace que los useEffect se ejecuten dos veces en desarrollo, es normal).
  <React.StrictMode>
    
    {/* 3. ENRUTADOR (ROUTER):
        Envolvemos <App /> con BrowserRouter.
        Esto le da el "superpoder" a toda la app de cambiar de URL 
        sin recargar la página (usando Link y Routes). */}
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </React.StrictMode>,
)