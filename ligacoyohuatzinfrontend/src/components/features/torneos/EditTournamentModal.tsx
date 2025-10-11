import React, { useState, useEffect } from 'react';
import { tournamentService } from '../../../services/tournamentService';
import { categoryService } from '../../../services/categoryService';
import { TorneoIn, CategoriaOut, CompeticionOut } from '../../../types/api';

interface EditTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTournamentUpdated: () => void;
  competicionToEdit: CompeticionOut | null;
}

const EditTournamentModal: React.FC<EditTournamentModalProps> = ({ isOpen, onClose, onTournamentUpdated, competicionToEdit }) => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [idCategoria, setIdCategoria] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [availableCategories, setAvailableCategories] = useState<CategoriaOut[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Carga los datos de la competición en el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && competicionToEdit) {
      // Cargar datos del torneo
      setNombre(competicionToEdit.torneo.nombre);
      setAnio(competicionToEdit.torneo.anio);
      // Cargar dato de la categoría
      setIdCategoria(competicionToEdit.categoria.idCategoria.toString());
      setError('');

      // Cargar la lista de categorías para el menú desplegable
      const fetchCategories = async () => {
        try {
          const allCategories = await categoryService.getCategorias();
          setAvailableCategories(allCategories);
        } catch (err) {
          setError('No se pudieron cargar las categorías existentes.');
        }
      };
      fetchCategories();

      setFechaInicio(competicionToEdit.torneo.fechaInicio);
      setFechaFin(competicionToEdit.torneo.fechaFin);
    }
  }, [isOpen, competicionToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competicionToEdit) return;

    setIsLoading(true);
    setError('');

    try {
      const apiCalls = [];

      // Comprueba si los datos del Torneo han cambiado
      const torneoChanged =
        nombre !== competicionToEdit.torneo.nombre ||
        anio !== competicionToEdit.torneo.anio ||
        fechaInicio !== competicionToEdit.torneo.fechaInicio ||
        fechaFin !== competicionToEdit.torneo.fechaFin;

      if (torneoChanged) {
        const torneoPatchData: Partial<TorneoIn> = {
          nombre,
          anio,
          fechaInicio,
          fechaFin
        };
        apiCalls.push(tournamentService.patchTorneo(competicionToEdit.torneo.idTorneo, torneoPatchData));
      }

      // Comprueba si la Categoría de la Competición ha cambiado
      if (idCategoria && parseInt(idCategoria) !== competicionToEdit.categoria.idCategoria) {
        apiCalls.push(tournamentService.patchCompeticion(competicionToEdit.idCompeticion, { idCategoria: parseInt(idCategoria) }));
      }

      if (apiCalls.length === 0) {
        setError("No se detectaron cambios para actualizar.");
        setIsLoading(false);
        return;
      }

      // Ejecuta todas las llamadas a la API necesarias
      await Promise.all(apiCalls);

      onTournamentUpdated(); // Refresca la lista en la página principal
      onClose(); // Cierra el modal

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 bg-opacity-95 text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-600 pb-4">Actualizar Torneo / Competición</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre del Torneo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Año del Torneo</label>
            <input type="number" value={anio} onChange={(e) => setAnio(parseInt(e.target.value))}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Categoría de la Competición</label>
            <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="" disabled>Selecciona una categoría</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Fecha de Inicio</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
                {/* Aquí podrías deshabilitarlo si el backend te informa que ya hay partidos */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fecha de Fin</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-4">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTournamentModal;