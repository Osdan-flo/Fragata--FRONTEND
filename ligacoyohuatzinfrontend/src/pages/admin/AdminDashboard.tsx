import React from 'react';
// --- CAMBIO 1: Importamos el hook useAuth para obtener los datos del usuario ---
import { useAuth } from '../../contexts/AuthContext';

import iconoPartido from '../../assets/images/Icono-Agregar-Partido.png';
import iconoEvento from '../../assets/images/icono-agregar-evento.png';
import iconoJugador from '../../assets/images/icono-agregar-jugador.png';
import iconoEntrenador from '../../assets/images/icono-agregar-entrenador.png';
import iconoCategoria from '../../assets/images/icono-agregar-categoria.png';
import iconoArbitro from '../../assets/images/icono-agregar-arbitro.png';
import iconoCoordinador from '../../assets/images/icono-agregar-coordinador.png';
import iconoTitulo from '../../assets/images/icono-agregar-titulo.png';

// El componente DashboardButton se queda igual, tu diseño es excelente.
const DashboardButton = ({ label, icon }: { label: string, icon: React.ReactNode }) => (
  <button className="bg-green-800 bg-opacity-50 border-2 border-green-900 rounded-lg p-12 flex flex-col items-center justify-center space-y-7 hover:bg-green-700 transition-colors group">
    <div className="w-32 h-32 text-black group-hover:text-white transition-colors">
      {icon}
    </div>
    <span className="text-white font-semibold text-center uppercase tracking-wider">
      {label}
    </span>
  </button>
);

const constructorButtons = [
  { label: 'Agregar Partido', icon: <img src={iconoPartido} alt="Agregar Partido" className="w-full h-full object-contain" /> },
  { label: 'Agregar Evento', icon: <img src={iconoEvento} alt="Agregar Evento" className="w-full h-full object-contain" /> },
  { label: 'Agregar Jugador', icon: <img src={iconoJugador} alt="Agregar Jugador" className="w-full h-full object-contain" /> },
  { label: 'Agregar Entrenador', icon: <img src={iconoEntrenador} alt="Agregar Entrenador" className="w-full h-full object-contain" /> },
  { label: 'Agregar Categoría', icon: <img src={iconoCategoria} alt="Agregar Categoría" className="w-full h-full object-contain" /> },
  { label: 'Agregar Árbitro', icon: <img src={iconoArbitro} alt="Agregar Arbitro" className="w-full h-full object-contain" /> },
  { label: 'Agregar Coordinador', icon: <img src={iconoCoordinador} alt="Agregar Coordinador" className="w-full h-full object-contain" /> },
  { label: 'Agregar Título', icon: <img src={iconoTitulo} alt="Agregar Titulo" className="w-full h-full object-contain" /> },
];

const AdminDashboard = () => {
  // --- CAMBIO 2: Usamos el hook para obtener el email del usuario logueado ---
  const { email } = useAuth();

  // --- CAMBIO 3: Procesamos el email para obtener solo el nombre antes del '@' ---
  const username = email ? email.split('@')[0] : 'Admin';

  return (
    <div>
      {/* --- CAMBIO 4: Aplicamos los nuevos estilos y el nombre de usuario dinámico --- */}
      <h2 className="text-white text-2xl font-bold text-center mb-10">
        Bienvenido {username}, ¿Qué deseas hacer?
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {constructorButtons.map((button) => (
          <DashboardButton
            key={button.label}
            label={button.label}
            icon={button.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;