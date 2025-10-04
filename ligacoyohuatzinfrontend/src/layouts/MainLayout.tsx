import React, { useState } from 'react'; // <-- CAMBIO: Importamos useState
import { Outlet, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import LoginModal from '../components/ui/LoginModal'; // <-- CAMBIO: Importamos el LoginModal

const MainLayout = () => {
  // --- CAMBIO: El estado y las funciones para controlar el modal ahora viven aquí ---
  const [showLoginCard, setShowLoginCard] = useState(false);
  const handleLoginClick = () => setShowLoginCard(true);
  const handleCloseLogin = () => setShowLoginCard(false);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col" style={{
      background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 25%, #4a7c23 50%, #3d6b1f 75%, #2d5016 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite'
    }}>
      {/* CAMBIO: Pasamos la función al Header para que el botón la pueda llamar */}
      <Header onLoginClick={handleLoginClick} />

      <nav className="bg-green-800 border-t border-black border-opacity-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3 w-full">
            <Link to="#" className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors text-center">Tabla de posiciones</Link>
            <Link to="#" className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors text-center">Partidos</Link>
            <Link to="/categorias" className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors text-center">Categorías</Link>
            <Link to="#" className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors text-center">Coordinación</Link>
            <Link to="#" className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors text-center">Árbitros</Link>
            <Link to="#" className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors text-center">Títulos</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 overflow-y-auto relative grass-texture">
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      {/* CAMBIO: Renderizamos el modal aquí, controlado por el estado de este layout */}
      {showLoginCard && (
        <LoginModal
          isOpen={showLoginCard}
          onClose={handleCloseLogin}
        />
      )}
    </div>
  );
};

export default MainLayout;