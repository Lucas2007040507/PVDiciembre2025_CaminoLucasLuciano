import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// SIN IMPORTAR CSS (Ya está todo en index.css)

export default function Login() {
  // 1. ESTADO DEL MODO: ¿Estoy logueando (true) o registrando (false)?
  const [isLogin, setIsLogin] = useState(true);

  // 2. ESTADO DEL FORMULARIO: Aquí guardamos TODOS los datos que el usuario escribe.
  const [formData, setFormData] = useState({ 
    nombre: '', email: '', password: '', rol: 'paciente', 
    especialidad: '', dni: '', telefono: '', piso: '', sala: '',
    edad: '', obraSocial: '' 
  });
  
  // 3. HERRAMIENTAS: Traemos las funciones del contexto y la navegación.
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // 4. MANEJADOR DE CAMBIOS: Se ejecuta cada vez que tocas una tecla.
  // Actualiza el campo correspondiente en 'formData'.
  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  // 5. ENVÍO DEL FORMULARIO: Se ejecuta al dar click en "Ingresar/Registrarse".
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue sola.
    
    if (isLogin) {
      // --- MODO LOGIN ---
      // Intentamos entrar. Si login() devuelve true, vamos al Dashboard.
      if (login(formData.email, formData.password)) navigate('/dashboard');
      else alert('Error en credenciales (Email o contraseña incorrectos)');
    } else {
      // --- MODO REGISTRO ---
      // Intentamos registrar. Si sale bien, volvemos al modo Login.
      if (register(formData)) { 
        alert('¡Registrado correctamente!'); 
        setIsLogin(true); // Cambiamos la pantalla para que ahora se loguee.
      } else {
        alert('El usuario ya existe');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Título dinámico: Cambia según el estado isLogin */}
        <h2 style={{color: '#2563eb'}}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* CAMPOS DE REGISTRO (Solo se ven si isLogin es FALSE) */}
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

              {/* CAMPOS EXTRA PARA MÉDICOS (Solo si eligió rol 'medico') */}
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

          {/* CAMPOS COMUNES (Siempre se ven: Email y Password) */}
          <input className="login-input" type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input className="login-input" type="password" name="password" placeholder="Contraseña" required onChange={handleChange} />
          
          <button className="login-btn" type="submit">{isLogin ? 'Ingresar' : 'Registrarse'}</button>
        </form>
        
        {/* BOTÓN PARA CAMBIAR ENTRE LOGIN Y REGISTRO */}
        <button style={{background:'none', border:'none', color:'#666', marginTop:'15px', textDecoration:'underline'}} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
        </button>
      </div>
    </div>
  );
}