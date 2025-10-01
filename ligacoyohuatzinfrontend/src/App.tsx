import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';

// La importación de './App.css' ha sido eliminada.

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/" element={<Home />} />

          {/* --- Rutas Protegidas de Administrador --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Futuras rutas del admin, como la de categorías, irán aquí */}
            {/* <Route path="categorias" element={<GestionCategorias />} /> */}
          </Route>

          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;