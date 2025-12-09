import { useAuth } from '../context/AuthContext'; // Para saber quién soy
import { useTurnos } from '../hooks/useTurnos';   // Para ver y borrar turnos
import { Link } from 'react-router-dom';          // Para ir a "Reservar"
import { jsPDF } from 'jspdf';                    // Para generar el PDF

export default function Dashboard() {
  // 1. DATOS: Traemos al usuario y las funciones de turnos
  const { user } = useAuth();
  const { turnos, cancelarTurno } = useTurnos();

  // 2. LÓGICA DE FILTRADO (MUY IMPORTANTE)
  // No mostramos todos los turnos, solo los que corresponden a este usuario.
  const misTurnos = user.rol === 'medico' 
    ? turnos.filter(t => t.medicoNombre === user.nombre) // Si soy médico, busco mis pacientes
    : turnos.filter(t => t.pacienteEmail === user.email); // Si soy paciente, busco mis citas

  // 3. FUNCIÓN GENERAR PDF
  const imprimirTurno = (turno) => {
    const doc = new jsPDF();
    doc.text("FICHA DE TURNO", 10, 20);
    doc.text(`Médico: ${turno.medicoNombre}`, 10, 40);
    doc.text(`Especialidad: ${turno.medicoEspecialidad}`, 10, 50);
    // Agregamos DNI y Edad del Médico al PDF
    doc.text(`DNI Med: ${turno.medicoDni} - Edad: ${turno.medicoEdad}`, 10, 60); 

    doc.text(`Paciente: ${turno.pacienteNombre}`, 10, 80);
    doc.text(`Edad: ${turno.pacienteEdad} - OS: ${turno.pacienteObraSocial}`, 10, 90);
    doc.text(`Horario: ${turno.horario} hs`, 10, 110);
    doc.save("turno.pdf");
  };

  // 4. FUNCIÓN CANCELAR
  const handleCancelar = (turno) => {
    // Ventanita de confirmación nativa del navegador
    if (window.confirm('¿Cancelar turno?')) cancelarTurno(turno);
  };

  return (
    <div className="container-centrado">
      <h1 style={{marginTop:'20px'}}>Hola, {user.nombre}</h1>

      {/* 5. RENDERIZADO CONDICIONAL: Solo el paciente ve este botón */}
      {user.rol === 'paciente' && (
        <Link to="/reservar" className="btn-new-turno">+ Solicitar Nuevo Turno</Link>
      )}

      <h2 className="section-title">Mis Turnos Agendados</h2>
      
      {/* 6. LISTA DE TURNOS */}
      {/* Si la lista está vacía (length 0), mostramos mensaje de aviso */}
      {misTurnos.length === 0 ? (
        <div className="card"><p>No tienes turnos registrados.</p></div>
      ) : (
        // Si hay turnos, usamos .map para dibujar una tarjeta por cada uno
        <div className="grilla">
          {misTurnos.map((t, index) => (
            <div key={index} className="turno-card">
              
              {/* Encabezado de la tarjeta (Hora) */}
              <h3>{t.horario} hs <span style={{fontSize:'0.7rem', background:'#e0f2fe', color:'#000', padding:'2px 5px', borderRadius:'4px'}}>MAÑANA</span></h3>
              
              {/* Cuerpo de la tarjeta (Datos) */}
              <div style={{fontSize:'0.9rem', marginBottom:'10px', textAlign:'left'}}>
                <p><strong>Médico:</strong> {t.medicoNombre}</p>

                <p><strong>Especialidad:</strong> {t.medicoEspecialidad}</p>

                <p><strong>Dni:</strong> {t.medicoDni}</p>

                <hr style={{margin:'8px 0', borderTop:'1px solid #eee'}}/>

                <p><strong>Piso:</strong> {t.medicoPiso}</p>
                
                <p><strong>Sala:</strong> {t.medicoSala}</p>
                
                <hr style={{margin:'8px 0', borderTop:'1px solid #eee'}}/>
                
                <p><strong>Paciente:</strong> {t.pacienteNombre}</p>
                {/* Mostramos los datos nuevos aquí */}
                <p><strong>Edad:</strong> {t.pacienteEdad}</p> 

                <p><strong>Obra Social:</strong> {t.pacienteObraSocial}</p>

                <p><strong>Dni:</strong> {t.pacienteDni}</p>

              </div>

              {/* Botones de Acción */}
              <button className="btn" style={{padding:'8px', marginTop:'5px'}} onClick={() => imprimirTurno(t)}>Ver PDF</button>
              <button className="btn-cancelar" onClick={() => handleCancelar(t)}>Cancelar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}