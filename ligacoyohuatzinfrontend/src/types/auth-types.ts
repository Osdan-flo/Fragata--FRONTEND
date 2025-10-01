// DTO para el login (igual que en tu AuthController del backend)
export interface LoginDto {
  email: string;
  password: string;
}

// DTO para la respuesta del token
export interface TokenDto {
  token: string;
}