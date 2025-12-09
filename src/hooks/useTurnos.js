import { useState, useEffect } from 'react';

export const useTurnos = () => {
  const [medicos, setMedicos] = useState([]);
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    // 1. Cargar Médicos
    const storedMedicos = localStorage.getItem('medicos');
    
    if (storedMedicos) {
      setMedicos(JSON.parse(storedMedicos));
    } else {
      // --- DATOS PRECARGADOS (SEMILLA) ---
      const medicosIniciales = [
        { 
          id: 1, 
          nombre: 'Dr. Ricardo Favaloro', 
          especialidad: 'Cardiología', 
          email: 'ricardo@clinica.com',
          telefono: '11-4455-6677', 
          dni: '12345678', 
          piso: '1', 
          sala: '18' 
        },
        { 
          id: 2, 
          nombre: 'Dra. Cecilia Grierson', 
          especialidad: 'Clínica Médica', 
          email: 'cecilia@clinica.com',
          telefono: '11-8899-0011', 
          dni: '25467890', 
          piso: 'PB', 
          sala: 'Consultorio 4' 
        },
        { 
          id: 3, 
          nombre: 'Dr. Luis Agote', 
          especialidad: 'Hematología', 
          email: 'luis@clinica.com',
          telefono: '11-2233-4455', 
          dni: '34567890', 
          piso: '2', 
          sala: '36' 
        },
        { 
          id: 4, 
          nombre: 'Dra. Julieta Lanteri', 
          especialidad: 'Cirugía', 
          email: 'julieta@clinica.com',
          telefono: '11-9988-7766', 
          dni: '13459821', 
          piso: '1', 
          sala: '41' 
        }
      ];
      // Guardamos estos datos iniciales
      localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
      setMedicos(medicosIniciales);
    }

    // 2. Cargar Turnos
    const storedTurnos = localStorage.getItem('turnosAgendados');
    if (storedTurnos) setTurnos(JSON.parse(storedTurnos));
  }, []);

  const guardarTurno = (nuevoTurno) => {
    const actualizados = [...turnos, nuevoTurno];
    setTurnos(actualizados);
    localStorage.setItem('turnosAgendados', JSON.stringify(actualizados));
  };

  const obtenerHorariosDisponibles = (medicoId) => {
    const horariosBase = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    const ocupados = turnos
      .filter(t => t.medicoId === parseInt(medicoId))
      .map(t => t.horario);
    return horariosBase.filter(h => !ocupados.includes(h));
  };

  const cancelarTurno = (turnoABorrar) => {
    const actualizados = turnos.filter(t => t !== turnoABorrar);
    setTurnos(actualizados);
    localStorage.setItem('turnosAgendados', JSON.stringify(actualizados));
  };

  return { medicos, turnos, guardarTurno, obtenerHorariosDisponibles, cancelarTurno };
};