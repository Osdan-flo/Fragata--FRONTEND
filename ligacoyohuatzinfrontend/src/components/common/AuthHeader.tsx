import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthHeaderProps {
  onLoginClick: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ onLoginClick }) => {
  const { isAuthenticated, email, logout } = useAuth();

  return (
    // Usamos las mismas clases de contenedor para ambos estados
    <div className="flex items-center space-x-2">
      {isAuthenticated ? (
        <> {/* Ya no se necesita el div extra aquí */}
          <span className="text-green-200 text-sm hidden md:inline">
            Hola, {email}
          </span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <span className="text-white text-sm">¿Eres administrador?</span>
          <button
            onClick={onLoginClick}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Iniciar Sesión
          </button>
        </>
      )}
    </div>
  );
};

export default AuthHeader;