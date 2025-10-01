import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/common/Header';

const AdminLayout = () => {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col" style={{
      background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 25%, #4a7c23 50%, #3d6b1f 75%, #2d5016 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite'
    }}>
      <Header />

      <nav className="bg-green-800 border-t border-green-700">
        <div className="container mx-auto px-4">
          {/* Contenedor de botones con centrado y espaciado */}
          <div className="flex justify-between items-center py-3 w-full">
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Tabla de posiciones</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Partidos</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Categorías</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Coordinación</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Árbitros</button>
            <button className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">Títulos</button>
          </div>
        </div>
      </nav>

      {/* Main con la clase de textura y z-index */}
      <main className="flex-1 p-6 overflow-y-auto relative grass-texture">
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;