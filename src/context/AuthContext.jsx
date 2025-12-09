import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuarioActivo');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('usuarioActivo', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    
    if (users.find(u => u.email === userData.email)) return false;
    
    // 1. Guardar usuario completo
    users.push(userData);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(users));

    // 2. Si es médico, lo agregamos a la lista pública CON PISO Y SALA
    if (userData.rol === 'medico') {
      const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
      const nuevoMedico = {
        id: Date.now(),
        nombre: userData.nombre,
        especialidad: userData.especialidad,
        dni: userData.dni,
        telefono: userData.telefono,
        email: userData.email,
        piso: userData.piso, // <--- GUARDAMOS PISO
        sala: userData.sala  // <--- GUARDAMOS SALA
      };
      medicos.push(nuevoMedico);
      localStorage.setItem('medicos', JSON.stringify(medicos));
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuarioActivo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};