import { useState, useEffect } from 'react';

// CUSTOM HOOK: Encapsula toda la lógica de turnos y médicos
export const useTurnos = () => {
  // 1. ESTADOS: Memoria temporal para la lista de médicos y turnos
  const [medicos, setMedicos] = useState([]);
  const [turnos, setTurnos] = useState([]);

  // 2. CARGA INICIAL (Efecto): Se ejecuta al abrir la app.
  useEffect(() => {
    // A. Cargar Médicos
    const storedMedicos = localStorage.getItem('medicos');
    
    if (storedMedicos) {
      // Si ya existen en memoria, los usamos.
      setMedicos(JSON.parse(storedMedicos));
    } else {
      // --- DATOS SEMILLA (SEED DATA) ---
      // Si es la primera vez que se abre la app, cargamos estos datos falsos
      // para que no esté vacía.
      const medicosIniciales = [
        { 
          id: 1, 
          nombre: 'Dr. Ricardo Favaloro', 
          especialidad: 'Cardiología', 
          email: 'ricardo@clinica.com',
          telefono: '11-4455-6677', 
          dni: '12345678', 
          piso: '1', 
          sala: '18',
        },
        { 
          id: 2, 
          nombre: 'Dra. Cecilia Grierson', 
          especialidad: 'Clínica Médica', 
          email: 'cecilia@clinica.com',
          telefono: '11-8899-0011', 
          dni: '25467890', 
          piso: 'PB', 
          sala: 'Consultorio 4',
        },
        { 
          id: 3, 
          nombre: 'Dr. Luis Agote', 
          especialidad: 'Hematología', 
          email: 'luis@clinica.com',
          telefono: '11-2233-4455', 
          dni: '34567890', 
          piso: '2', 
          sala: '36',
        },
        { 
          id: 4, 
          nombre: 'Dra. Julieta Lanteri', 
          especialidad: 'Cirugía', 
          email: 'julieta@clinica.com',
          telefono: '11-9988-7766', 
          dni: '13459821', 
          piso: '1', 
          sala: '41' ,
        }
      ];
      // Guardamos estos datos iniciales en el navegador
      localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
      setMedicos(medicosIniciales);
    }

    // B. Cargar Turnos Agendados previamente
    const storedTurnos = localStorage.getItem('turnosAgendados');
    if (storedTurnos) setTurnos(JSON.parse(storedTurnos));
  }, []);

  // 3. FUNCIÓN PARA GUARDAR UN TURNO
  const guardarTurno = (nuevoTurno) => {
    // Creamos un nuevo array con lo que había antes (...turnos) + el nuevo
    const actualizados = [...turnos, nuevoTurno];
    setTurnos(actualizados);
    // Actualizamos la "base de datos" local
    localStorage.setItem('turnosAgendados', JSON.stringify(actualizados));
  };

  // 4. LÓGICA DE FILTRADO DE HORARIOS (IMPORTANTE)
  const obtenerHorariosDisponibles = (medicoId) => {
    const horariosBase = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    
    // Buscamos qué horarios YA están ocupados para ESTE médico en particular
    const ocupados = turnos
      .filter(t => t.medicoId === parseInt(medicoId)) // Filtramos por médico
      .map(t => t.horario); // Nos quedamos solo con la hora (ej: "10:00")
    
    // Devolvemos los horarios base que NO estén en la lista de ocupados
    return horariosBase.filter(h => !ocupados.includes(h));
  };

  // 5. FUNCIÓN PARA CANCELAR
  const cancelarTurno = (turnoABorrar) => {
    // Filtramos la lista: Dejamos pasar a todos los que sean DISTINTOS al que queremos borrar
    const actualizados = turnos.filter(t => t !== turnoABorrar);
    setTurnos(actualizados);
    localStorage.setItem('turnosAgendados', JSON.stringify(actualizados));
  };

  // Exponemos todo para que los componentes (Dashboard, Reservar) lo usen
  return { medicos, turnos, guardarTurno, obtenerHorariosDisponibles, cancelarTurno };
};