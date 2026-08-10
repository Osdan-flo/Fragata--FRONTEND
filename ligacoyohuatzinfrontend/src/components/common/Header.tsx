import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthHeader from './AuthHeader';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Variable para saber si estamos en la página de inicio
  const isHomePage = location.pathname === '/';
  const isAdminDashboard = location.pathname === '/admin/dashboard';

  return (
    <header className="bg-green-700 shadow-lg">
      <div className="px-10 py-5 relative flex justify-between items-center">

        {/* --- LADO IZQUIERDO: ICONOS DE NAVEGACIÓN --- */}
        <div className="flex-shrink-0 flex items-center space-x-4 min-w-[2rem] min-h-[2rem]">

          {!isHomePage && (
            // Fuera del Home (Categorías, Torneos, Admin Dashboard, etc.) siempre mostramos
            // el ícono de la casa para volver a la página principal.
            <Link to="/" title="Ir a la página principal" className="text-white hover:text-green-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </Link>
          )}

          {isAuthenticated && !isAdminDashboard && (
            // Si el admin está autenticado y no está ya en el dashboard (sea desde el Home
            // o desde cualquier otro panel: Categorías, Torneos, etc.), mostramos el acceso
            // directo al Constructor/Dashboard.
            <Link to="/admin/dashboard" title="Ir al Dashboard de Administración" className="text-white hover:text-green-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </Link>
          )}

        </div>

        {/* --- CENTRO: TÍTULO --- */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4">
          <div className="text-white text-4xl spin-ball">⚽</div>
          <h1 className="text-white text-center text-nowrap text-2xl md:text-3xl font-bold">Liga Coyohuatzin Coyoacán</h1>
          <div className="text-white text-4xl spin-ball">⚽</div>
        </div>

        {/* --- LADO DERECHO: LOGIN/LOGOUT --- */}
        <div className="flex-shrink-0">
          <AuthHeader onLoginClick={onLoginClick!} />
        </div>

      </div>
    </header>
  );
};

export default Header;