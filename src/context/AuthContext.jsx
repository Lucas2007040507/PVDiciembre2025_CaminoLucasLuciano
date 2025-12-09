import { createContext, useState, useEffect, useContext } from 'react';

// 1. CREACIÓN DEL CONTEXTO: Creamos la "Nube" de datos.
const AuthContext = createContext();

// 2. HOOK PERSONALIZADO: Esta funcioncita nos permite usar el contexto
// fácilmente en cualquier otro archivo con solo llamar a useAuth().
export const useAuth = () => useContext(AuthContext);

// 3. EL PROVEEDOR: Este componente envuelve a toda la app y maneja la lógica.
export const AuthProvider = ({ children }) => {
  // Estado para saber quién está conectado actualmente (null = nadie).
  const [user, setUser] = useState(null);

  // EFECTO DE INICIO: Se ejecuta solo una vez al cargar la página.
  // Sirve para que si refrescas la página (F5), no se pierda tu sesión.
  useEffect(() => {
    const storedUser = localStorage.getItem('usuarioActivo');
    if (storedUser) setUser(JSON.parse(storedUser)); // Si había alguien, lo restauramos.
  }, []);

  // FUNCIÓN DE LOGIN
  const login = (email, password) => {
    // Leemos la "base de datos" del navegador (localStorage)
    const users = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    
    // Buscamos si existe alguien con ese email y contraseña
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser); // Actualizamos el estado de React
      localStorage.setItem('usuarioActivo', JSON.stringify(foundUser)); // Guardamos en navegador
      return true; // Login exitoso
    }
    return false; // Login fallido
  };

  // FUNCIÓN DE REGISTRO
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    
    // Validamos que no se repita el email
    if (users.find(u => u.email === userData.email)) return false;
    
    // 1. Guardamos al usuario para que pueda iniciar sesión después
    users.push(userData);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(users));

    // 2. MAGIA: Si el rol es MÉDICO, lo agregamos a la lista pública de especialistas
    // para que los pacientes puedan sacarle turno inmediatamente.
    if (userData.rol === 'medico') {
      const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
      const nuevoMedico = {
        id: Date.now(), // Generamos un ID único usando la hora actual
        nombre: userData.nombre,
        especialidad: userData.especialidad,
        dni: userData.dni,
        telefono: userData.telefono,
        email: userData.email,
        piso: userData.piso, 
        sala: userData.sala  
      };
      medicos.push(nuevoMedico);
      // Guardamos la lista actualizada de médicos
      localStorage.setItem('medicos', JSON.stringify(medicos));
    }

    return true; // Registro exitoso
  };

  // FUNCIÓN DE SALIR
  const logout = () => {
    setUser(null); // Ponemos el estado en vacío
    localStorage.removeItem('usuarioActivo'); // Borramos la sesión del navegador
  };

  // RENDER: Exponemos las funciones y variables a toda la app (children)
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};