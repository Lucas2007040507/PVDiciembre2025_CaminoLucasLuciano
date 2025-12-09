import { useState } from 'react';
import { useTurnos } from '../hooks/useTurnos';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// SIN IMPORTAR CSS (Ya está en index.css)

export default function ReservarTurno() {
  // 1. HERRAMIENTAS: Traemos la lista de médicos, el usuario actual y la navegación.
  const { medicos, guardarTurno, obtenerHorariosDisponibles } = useTurnos();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 2. MEMORIA TEMPORAL: Guardamos qué va eligiendo el usuario paso a paso.
  const [medicoSel, setMedicoSel] = useState('');   // ¿Qué médico eligió?
  const [horarioSel, setHorarioSel] = useState(''); // ¿Qué hora eligió?
  const [step, setStep] = useState(1);              // ¿En qué paso está? (1, 2 o 3)

  // 3. FUNCIÓN FINAL: Se ejecuta al confirmar todo.
  const handleConfirmar = () => {
    // Buscamos los datos completos del médico elegido usando su ID
    const medicoData = medicos.find(m => m.id === parseInt(medicoSel));
    
    // CREAMOS EL TURNO FINAL: Mezclamos datos del Médico + Datos del Paciente
    const nuevoTurno = {
      horario: horarioSel, 
      fecha: 'Mañana',
      
      // DATOS DEL MÉDICO (Para saber con quién es)
      medicoId: parseInt(medicoSel), 
      medicoNombre: medicoData.nombre, 
      medicoEspecialidad: medicoData.especialidad,
      medicoEmail: medicoData.email || 'S/D', 
      medicoTel: medicoData.telefono || 'S/D',
      medicoDni: medicoData.dni || 'S/D',   
      medicoPiso: medicoData.piso || '-', 
      medicoSala: medicoData.sala || '-',
      
      // DATOS DEL PACIENTE (Para saber quién va)
      pacienteNombre: user.nombre, 
      pacienteEmail: user.email, 
      pacienteDni: user.dni || 'S/D', 
      pacienteTel: user.telefono || 'S/D',
      pacienteEdad: user.edad || '-',           // Guardamos la Edad
      pacienteObraSocial: user.obraSocial || '-' // Guardamos la Obra Social
    };
    
    // Guardamos en memoria y volvemos al inicio
    guardarTurno(nuevoTurno);
    alert('¡Turno reservado!');
    navigate('/dashboard');
  };

  // Helper para mostrar el nombre del médico en los pasos 2 y 3
  const medicoData = medicos.find(m => m.id === parseInt(medicoSel));

  return (
    <div className="container-centrado">
      
      {/* --- PASO 1: ELEGIR MÉDICO --- */}
      {step === 1 && (
        <>
          <h1>Nuestros Especialistas</h1>
          <p style={{marginBottom:'30px'}}>Seleccione un profesional</p>
          
          <div className="grilla">
            {medicos.map(m => (
              <div key={m.id} className="medico-card">
                <div>
                   <div className="medico-avatar">{m.nombre.charAt(0).toUpperCase()}</div>
                   <h3 className="medico-nombre">{m.nombre}</h3>
                   <span className="medico-esp">{m.especialidad}</span>
                   <p style={{marginTop:'10px', fontSize:'0.85rem', color:'#666'}}>
                     Piso: {m.piso} | Sala: {m.sala}
                   </p>
                </div>
                {/* Al clickear, guardamos el ID y pasamos al Step 2 */}
                <button className="btn-solicitar" onClick={() => {setMedicoSel(m.id); setStep(2);}}>
                  Solicitar Turno
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- PASO 2: ELEGIR HORARIO --- */}
      {step > 1 && (
        <div className="card" style={{maxWidth:'500px'}}>
          {step === 2 && (
            <>
               <h2 style={{color:'#2563eb'}}>Horarios</h2>
               <p style={{color:'black', fontSize:'1.1rem'}}>Dr/a: <strong>{medicoData?.nombre}</strong></p>
               
               {/* Grilla de botones con las horas disponibles */}
               <div style={{display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center', margin:'20px 0'}}>
                 {obtenerHorariosDisponibles(medicoSel).map(h => (
                   <button key={h} onClick={() => setHorarioSel(h)} style={{
                     padding:'10px', border:'2px solid #2563eb', borderRadius:'5px', cursor:'pointer', fontWeight:'bold', width:'80px',
                     // Si está seleccionado, se pinta de azul
                     background: horarioSel === h ? '#2563eb' : 'white', 
                     color: horarioSel === h ? 'white' : '#2563eb'
                   }}>{h}</button>
                 ))}
               </div>
               
               {/* Botones de Navegación (Volver / Siguiente) */}
               <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                 <button className="btn" style={{background:'#666', width:'auto'}} onClick={() => setStep(1)}>Volver</button>
                 {horarioSel && <button className="btn" style={{width:'auto'}} onClick={() => setStep(3)}>Siguiente</button>}
               </div>
            </>
          )}

          {/* --- PASO 3: CONFIRMACIÓN --- */}
          {step === 3 && (
            <>
              <h2 style={{color:'#2563eb'}}>Confirmar</h2>
              
              {/* Resumen de datos */}
              <div style={{textAlign:'left', background:'#f9f9f9', padding:'20px', borderRadius:'10px', marginBottom:'20px'}}>
                <p><strong>Médico:</strong> {medicoData?.nombre}</p>
                <p><strong>Especialidad:</strong> {medicoData?.especialidad}</p>
                <p><strong>Lugar:</strong> Sala {medicoData?.sala} (Piso {medicoData?.piso})</p>
                <hr style={{margin:'10px 0', borderTop:'1px solid #ddd'}}/>
                <p><strong>Paciente:</strong> {user.nombre}</p>
                <p><strong>Edad:</strong> {user.edad} años - <strong>OS:</strong> {user.obraSocial}</p>
                <p style={{color:'#2563eb', marginTop:'10px'}}><strong>Horario:</strong> {horarioSel} hs</p>
              </div>
              
              <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                 <button className="btn" style={{background:'#666', width:'auto'}} onClick={() => setStep(2)}>Atrás</button>
                 <button className="btn" style={{width:'auto'}} onClick={handleConfirmar}>CONFIRMAR</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}