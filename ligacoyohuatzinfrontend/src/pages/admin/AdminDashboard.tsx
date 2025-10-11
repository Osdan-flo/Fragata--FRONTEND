import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CreateCategoryModal from '../../components/features/categorias/CreateCategoryModal';
import CreateTournamentModal from '../../components/features/torneos/CreateTournamentModal';

// Importaciones de tus íconos
import iconoPartido from '../../assets/images/Icono-Agregar-Partido.png';
import iconoEvento from '../../assets/images/icono-agregar-evento.png';
import iconoJugador from '../../assets/images/icono-agregar-jugador.png';
import iconoEntrenador from '../../assets/images/icono-agregar-entrenador.png';
import iconoCategoria from '../../assets/images/icono-agregar-categoria.png';
import iconoArbitro from '../../assets/images/icono-agregar-arbitro.png';
import iconoCoordinador from '../../assets/images/icono-agregar-coordinador.png';
import iconoTitulo from '../../assets/images/icono-agregar-titulo.png';
import iconoEquipo from '../../assets/images/icono-agregar-equipo.png';
import iconoTorneo from '../../assets/images/icono-agregar-torneo.png';

// --- CAMBIO 1: El componente ahora recibe 'description' y tiene la nueva estructura para el hover ---
const DashboardButton = ({ label, icon, description, action }: { label: string, icon: React.ReactNode, description: string, action?: () => void }) => (
  // Tu botón con overflow-hidden ya está casi perfecto
  <button onClick={action} className="relative bg-green-800 bg-opacity-50 border-2 border-green-900 rounded-lg p-12 flex flex-col items-center justify-center space-y-7 group overflow-hidden">
    <div className="w-32 h-32 text-black transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <span className="text-white font-semibold text-center uppercase tracking-wider">
      {label}
    </span>

    {/* --- Capa flotante para el efecto hover con blur y descripción --- */}
    {/* CAMBIO CLAVE: Añadimos 'rounded-lg' para que coincida con el botón padre */}
    <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-white text-center font-medium">{description}</p>
    </div>
  </button>
);

const AdminDashboard = () => {
  const { email } = useAuth();
  const username = email ? email.split('@')[0] : 'Admin';

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);

  const handleRefreshData = () => {
    console.log("Refrescando datos de la página...");
  };

  const constructorButtons = [
    { label: 'Agregar Partido', icon: <img src={iconoPartido} alt="Agregar Partido" className="w-full h-full object-contain" />, description: "Programa un nuevo encuentro entre dos equipos." },
    { label: 'Agregar Evento', icon: <img src={iconoEvento} alt="Agregar Evento" className="w-full h-full object-contain" />, description: "Registra goles, tarjetas y otros incidentes de un partido ya jugado." },
    { label: 'Agregar Jugador', icon: <img src={iconoJugador} alt="Agregar Jugador" className="w-full h-full object-contain" />, description: "Da de alta a un nuevo jugador en la base de datos de la liga." },
    { label: 'Agregar Equipo', icon: <img src={iconoEquipo} alt="Agregar Equipo" className="w-full h-full object-contain" />, description: 'Da de alta a un nuevo equipo en una categoría.' },
    { label: 'Agregar Torneo', icon: <img src={iconoTorneo} alt="Agregar Torneo" className="w-full h-full object-contain" />, description: "Crea un nuevo evento de torneo y su primera competición.", action: () => setIsTournamentModalOpen(true) },
    { label: 'Agregar Entrenador', icon: <img src={iconoEntrenador} alt="Agregar Entrenador" className="w-full h-full object-contain" />, description: "Registra a un nuevo entrenador." },
    // --- CAMBIO 2: Corregimos el nombre de la función a 'setIsCategoryModalOpen' ---
    { label: 'Agregar Categoría', icon: <img src={iconoCategoria} alt="Agregar Categoría" className="w-full h-full object-contain" />, description: "Crea una nueva categoría, como 'Infantil' o 'Libre'.", action: () => setIsCategoryModalOpen(true) },
    { label: 'Agregar Árbitro', icon: <img src={iconoArbitro} alt="Agregar Arbitro" className="w-full h-full object-contain" />, description: "Da de alta a un nuevo árbitro." },
    { label: 'Agregar Coordinador', icon: <img src={iconoCoordinador} alt="Agregar Coordinador" className="w-full h-full object-contain" />, description: "Registra a un nuevo miembro de la coordinación." },
    { label: 'Agregar Título', icon: <img src={iconoTitulo} alt="Agregar Titulo" className="w-full h-full object-contain" />, description: "Asigna un título de campeón a un equipo o jugador." },
  ];

  return (
    <div>
      <h2 className="text-white text-2xl font-bold text-center mb-10">
        Bienvenido {username}, ¿Qué deseas hacer?
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {constructorButtons.map((button) => (
          <DashboardButton
            key={button.label}
            label={button.label}
            icon={button.icon}
            description={button.description}
            action={button.action}
          />
        ))}
      </div>

      <CreateCategoryModal
              isOpen={isCategoryModalOpen}
              onClose={() => setIsCategoryModalOpen(false)}
              onCategoryCreated={handleRefreshData}
      />

      <CreateTournamentModal
             isOpen={isTournamentModalOpen}
             onClose={() => setIsTournamentModalOpen(false)}
             onTournamentCreated={handleRefreshData}
      />
    </div>
  );
};

export default AdminDashboard;