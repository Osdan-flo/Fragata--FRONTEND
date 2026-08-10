import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });

      // Mostrar mensaje de éxito
      setLoginSuccess(true);

      // Retrasar el cierre para que el navegador detecte el login exitoso
      setTimeout(() => {
        onClose();
        setLoginSuccess(false);
      }, 200);
    } catch (err) {
      console.error("Fallo el login desde el modal");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-700 rounded-xl shadow-2xl p-10 w-full max-w-2xl relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-green-700 hover:bg-green-600 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
          disabled={isLoading}
          aria-label="Cerrar modal"
        >
          <span className="text-black text-3xl font-bold leading-none">×</span>
        </button>

        {loginSuccess ? (
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold">¡Login Exitoso!</h3>
            <p className="mt-2">Serás redirigido en un momento...</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="text-white text-5xl mb-3">⚽</div>
              <h3 className="text-white text-3xl font-bold mb-3">¡HOLA ADMIN!</h3>
              <p className="text-green-100 text-base">Por favor ingresa tus datos para poder gestionar tu liga</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="w-full px-5 py-4 bg-green-800 border border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50 text-base"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-5 py-4 pr-12 bg-green-800 border border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50 text-base"
                  disabled={isLoading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-green-300 hover:text-green-100 transition-colors ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.45703 12C3.73128 7.94291 7.52159 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C20.2672 16.0571 16.4769 19 11.9992 19C7.52159 19 3.73128 16.0571 2.45703 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.9992 15C13.6561 15 14.9992 13.6569 14.9992 12C14.9992 10.3431 13.6561 9 11.9992 9C10.3424 9 8.99924 10.3431 8.99924 12C8.99924 13.6569 10.3424 15 11.9992 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </div>
              {error && (
                <div className="bg-red-500 text-white px-5 py-3 rounded-lg text-base text-center font-medium">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password.trim()}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 px-5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>
        )}

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
        `}</style>
      </div>
    </div>
  );
};

export default LoginModal;