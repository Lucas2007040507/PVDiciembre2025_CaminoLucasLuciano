import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// SIN IMPORTAR CSS

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    nombre: '', email: '', password: '', rol: 'paciente', 
    especialidad: '', dni: '', telefono: '', piso: '', sala: '',
    edad: '', obraSocial: '' // <--- NUEVOS
  });
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (login(formData.email, formData.password)) navigate('/dashboard');
      else alert('Error en credenciales');
    } else {
      if (register(formData)) { alert('Registrado!'); setIsLogin(true); }
      else alert('Usuario ya existe');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{color: '#2563eb'}}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input className="login-input" type="text" name="nombre" placeholder="Nombre completo" required onChange={handleChange} />
              
              <div style={{display:'flex', gap:'10px'}}>
                <input className="login-input" type="number" name="dni" placeholder="DNI" required onChange={handleChange} />
                <input className="login-input" type="number" name="edad" placeholder="Edad" required onChange={handleChange} />
              </div>

              <input className="login-input" type="text" name="obraSocial" placeholder="Obra Social (ej: OSDE, Particular)" required onChange={handleChange} />
              <input className="login-input" type="tel" name="telefono" placeholder="Teléfono" required onChange={handleChange} />
              
              <select className="login-input" name="rol" onChange={handleChange} value={formData.rol}>
                <option value="paciente">Soy Paciente</option>
                <option value="medico">Soy Médico</option>
              </select>

              {formData.rol === 'medico' && (
                <>
                  <input className="login-input" type="text" name="especialidad" placeholder="Especialidad" required onChange={handleChange} />
                  <div style={{display:'flex', gap:'10px'}}>
                    <input className="login-input" type="text" name="piso" placeholder="Piso" required onChange={handleChange} />
                    <input className="login-input" type="text" name="sala" placeholder="Sala" required onChange={handleChange} />
                  </div>
                </>
              )}
            </>
          )}
          <input className="login-input" type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input className="login-input" type="password" name="password" placeholder="Contraseña" required onChange={handleChange} />
          <button className="login-btn" type="submit">{isLogin ? 'Ingresar' : 'Registrarse'}</button>
        </form>
        <button style={{background:'none', border:'none', color:'#666', marginTop:'15px', textDecoration:'underline'}} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
        </button>
      </div>
    </div>
  );
}