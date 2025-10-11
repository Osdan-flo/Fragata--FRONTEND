import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import GestionCategorias from './pages/admin/GestionCategorias';
import TablaDePosiciones from './pages/TablaDePosiciones';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* CAMBIO: Todas las rutas ahora viven dentro de un <Route> padre
              que renderiza MainLayout. Esto asegura que TODAS las páginas
              tengan el mismo encabezado, fondo y barra de navegación. */}
          <Route element={<MainLayout />}>

            {/* --- Rutas Públicas --- */}
            <Route path="/" element={<Home />} />
            <Route path="/categorias" element={<GestionCategorias />} />
            <Route path="/posiciones" element={<TablaDePosiciones />} />

            {/* --- Contenedor de Rutas Protegidas de Administrador --- */}
            {/* Usamos un Outlet anidado que es protegido por ProtectedRoute.
                Cualquier ruta dentro de este bloque requerirá login. */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Aquí irán todas las futuras rutas que empiecen con /admin/...
                  Por ejemplo: <Route path="/admin/equipos" element={<GestionEquipos />} /> */}
            </Route>

            {/* Ruta para manejar páginas no encontradas */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />

          </Route> {/* <-- ESTA ES LA ETIQUETA DE CIERRE QUE FALTABA */}

        </Routes>
      </AuthProvider>
    </Router>
  );
}

// CAMBIO: La función MainLayoutWrapper ya no es necesaria con esta nueva estructura, la puedes eliminar.

export default App;