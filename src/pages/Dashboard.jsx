import { useAuth } from '../context/AuthContext';
import { useTurnos } from '../hooks/useTurnos';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
// SIN IMPORTAR CSS

export default function Dashboard() {
  const { user } = useAuth();
  const { turnos, cancelarTurno } = useTurnos();

  const misTurnos = user.rol === 'medico' 
    ? turnos.filter(t => t.medicoNombre === user.nombre)
    : turnos.filter(t => t.pacienteEmail === user.email);

  const imprimirTurno = (turno) => {
    const doc = new jsPDF();
    doc.text("FICHA DE TURNO", 10, 20);
    doc.text(`Médico: ${turno.medicoNombre}`, 10, 40);
    doc.text(`Paciente: ${turno.pacienteNombre}`, 10, 60);
    doc.text(`Edad: ${turno.pacienteEdad} - OS: ${turno.pacienteObraSocial}`, 10, 70); // <--- PDF
    doc.text(`Horario: ${turno.horario} hs`, 10, 90);
    doc.save("turno.pdf");
  };

  const handleCancelar = (turno) => {
    if (window.confirm('¿Cancelar turno?')) cancelarTurno(turno);
  };

  return (
    <div className="container-centrado">
      <h1 style={{marginTop:'20px'}}>Hola, {user.nombre}</h1>

      {user.rol === 'paciente' && (
        <Link to="/reservar" className="btn-new-turno">+ Solicitar Nuevo Turno</Link>
      )}

      <h2 className="section-title">Mis Turnos Agendados</h2>
      
      {misTurnos.length === 0 ? (
        <div className="card"><p>No tienes turnos registrados.</p></div>
      ) : (
        <div className="grilla">
          {misTurnos.map((t, index) => (
            <div key={index} className="turno-card">
              <h3>{t.horario} hs <span style={{fontSize:'0.7rem', background:'#e0f2fe', color:'#000', padding:'2px 5px', borderRadius:'4px'}}>MAÑANA</span></h3>
              
              <div style={{fontSize:'0.9rem', marginBottom:'10px', textAlign:'left'}}>
                <p><strong>Médico:</strong> {t.medicoNombre}</p>
                <p style={{color:'#666'}}>Sala: {t.medicoSala} - Piso: {t.medicoPiso}</p>
                <hr style={{margin:'8px 0', borderTop:'1px solid #eee'}}/>
                <p><strong>Paciente:</strong> {t.pacienteNombre}</p>
                <p>Edad: {t.pacienteEdad} | OS: {t.pacienteObraSocial}</p> {/* <--- AQUÍ ESTÁ */}
                <p style={{color:'#666'}}>DNI: {t.pacienteDni}</p>
              </div>

              <button className="btn" style={{padding:'8px', marginTop:'5px'}} onClick={() => imprimirTurno(t)}>Ver PDF</button>
              <button className="btn-cancelar" onClick={() => handleCancelar(t)}>Cancelar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}