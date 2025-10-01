import React, { useState } from 'react';
import Header from '../components/common/Header';
import LoginModal from '../components/ui/LoginModal';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [showLoginCard, setShowLoginCard] = useState(false);

  const handleLoginClick = () => setShowLoginCard(true);
  const handleCloseLogin = () => setShowLoginCard(false);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col" style={{
      background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 25%, #4a7c23 50%, #3d6b1f 75%, #2d5016 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite'
    }}>

      <Header onLoginClick={handleLoginClick} />

      <nav className="bg-green-800 border-t border-green-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3 w-full">
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Tabla de posiciones</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Partidos</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Categorías</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Coordinación</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Árbitros</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Títulos</button>
          </div>
        </div>
      </nav>

      <main className="flex-1 px-4 py-8 relative grass-texture">
        <div className="relative z-10 flex justify-center h-full">
          <div className="max-w-4xl w-full h-full">
            <div className="flex h-full">
              {/* Columna izquierda */}
              <div className="w-1/2 pr-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ubicados en Coyoacán...</h2>
                <div className="space-y-3 text-gray-700">
                  <p>Liga de fútbol amateur en el corazón de Coyoacán</p>
                  <p>Promovemos el deporte y la sana competencia</p>
                  <p>Equipos de todas las edades y niveles</p>
                  <p>Torneos regulares y eventos especiales</p>
                  <p>Ambiente familiar y deportivo</p>
                  <p>Instalaciones en excelente estado</p>
                  <p>Arbitraje profesional y justo</p>
                  <div className="space-y-2 mt-6">
                    <p>📍 Ubicación: Coyoacán, CDMX</p>
                    <p>⚽ Múltiples categorías disponibles</p>
                    <p>🏆 Torneos todo el año</p>
                    <p>👥 Más de 100 equipos participantes</p>
                  </div>
                </div>
              </div>

              {/* Línea divisoria */}
              <div className="w-px bg-black mx-8"></div>

              {/* Columna derecha */}
              <div className="w-1/2 pl-8 relative">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">⚽</div>
                    <p className="text-lg">
                      {isAuthenticated
                        ? "¡Bienvenido! Revisa el panel de administración."
                        : "Contenido próximamente..."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showLoginCard && (
          <LoginModal
            isOpen={showLoginCard}
            onClose={handleCloseLogin}
          />
        )}
      </main>
    </div>
  );
};

export default Home;