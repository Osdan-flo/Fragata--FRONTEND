import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Muestra un loader mientras se verifica el estado de autenticación.
  // Esto evita un "parpadeo" a la página de login al recargar.
  if (isLoading) {
    return <div>Cargando...</div>; // O un spinner más elaborado
  }

  // 2. Si no está autenticado, redirige al usuario a la página de inicio.
  // 'replace' evita que el usuario pueda volver a la ruta protegida con el botón "atrás".
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Si está autenticado, muestra el contenido de la ruta protegida.
  return <>{children}</>;
};

export default ProtectedRoute;