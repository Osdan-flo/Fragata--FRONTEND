import React from 'react'; // <-- CAMBIO: Ya no se necesita useState aquí
import { useAuth } from '../contexts/AuthContext';
// <-- CAMBIO: Ya no se necesita importar LoginModal aquí

const Home = () => {
  const { isAuthenticated } = useAuth();

  // --- CAMBIO: El estado y las funciones del modal se han eliminado de aquí ---

  return (
    <> {/* Usamos un fragmento porque el layout ya nos da el div principal */}
      <div className="flex justify-center h-full">
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

      {/* CAMBIO: El LoginModal ya no se renderiza aquí */}
    </>
  );
};

export default Home;