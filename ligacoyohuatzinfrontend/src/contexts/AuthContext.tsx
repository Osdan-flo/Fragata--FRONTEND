import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { LoginDto } from '../types/auth-types';

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  token: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Inicia en true para verificar sesión
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Al cargar la app, verifica si hay un usuario guardado en sessionStorage
    const user = authService.getStoredUser();
    if (user) {
      setIsAuthenticated(true);
      setEmail(user.email);
      setToken(user.token);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token } = await authService.login(credentials);
      authService.storeToken(token, credentials.email);
      setIsAuthenticated(true);
      setToken(token);
      setEmail(credentials.email);

      navigate('/admin/dashboard');

    } catch (err: any) {
      // 1. Buscamos el mensaje de error específico en la respuesta del backend.
      //    Axios lo pone en err.response.data.error
      const errorMessage = err.response?.data?.error || "Error de autenticación. Intenta de nuevo.";

      // 2. Actualizamos el estado con el mensaje específico.
      setError(errorMessage);

      // 3. Lanzamos el error para que el componente que llamó (LoginModal) sepa que falló.
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setToken(null);
    setEmail(null);
    navigate('/');
  };

  const value = { isAuthenticated, email, token, login, logout, isLoading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};