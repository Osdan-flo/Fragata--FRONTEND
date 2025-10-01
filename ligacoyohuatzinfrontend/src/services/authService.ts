// src/services/authService.ts
import apiClient from '../lib/axios';
import { LoginDto, TokenDto } from '../types/auth-types';

const login = async (credentials: LoginDto): Promise<TokenDto> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

const storeToken = (token: string, email: string) => {
  sessionStorage.setItem('adminToken', token);
  sessionStorage.setItem('adminEmail', email);
};

const logout = () => {
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminEmail');
};

const getStoredUser = () => {
  const token = sessionStorage.getItem('adminToken');
  const email = sessionStorage.getItem('adminEmail');
  return token && email ? { token, email } : null;
};

export const authService = {
  login,
  logout,
  storeToken,
  getStoredUser,
};