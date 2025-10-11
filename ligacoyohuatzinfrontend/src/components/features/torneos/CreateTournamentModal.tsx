import React, { useState, useEffect } from 'react';
import { tournamentService } from '../../../services/tournamentService';
import { categoryService } from '../../../services/categoryService';
import { CategoriaOut } from '../../../types/api';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTournamentCreated: () => void;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({ isOpen, onClose, onTournamentCreated }) => {
  const [nombre, setNombre] = useState('');
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idCategoria, setIdCategoria] = useState('');

  const [availableCategories, setAvailableCategories] = useState<CategoriaOut[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Limpia el formulario cada vez que se abre
      setNombre('');
      setAnio(new Date().getFullYear());
      setFechaInicio('');
      setFechaFin('');
      setIdCategoria('');
      setError('');

      // Carga las categorías disponibles para el menú desplegable
      const fetchCategories = async () => {
        try {
          const categories = await categoryService.getCategorias();
          setAvailableCategories(categories);
        } catch (err) {
          setError('No se pudieron cargar las categorías.');
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        // Llamamos a la nueva función unificada
        await tournamentService.createTournamentAndCompetition({
          nombre,
          anio,
          fechaInicio,
          fechaFin,
          idCategoria: parseInt(idCategoria)
        });
        onTournamentCreated();
        onClose();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al crear.');
      } finally {
        setIsLoading(false);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in"
        style={{ backgroundColor: '#610000' }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-600 pb-4">Constructor de Torneo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre del nuevo torneo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ej: Apertura" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Año del Torneo</label>
            <input type="number" value={anio} onChange={(e) => setAnio(parseInt(e.target.value))}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Fecha de Inicio</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fecha de Fin</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Crear competición para la categoría</label>
            <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" required>
              <option value="" disabled>Selecciona una categoría</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-4">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
              {isLoading ? 'Creando...' : 'CREAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentModal;