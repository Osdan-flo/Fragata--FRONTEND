import React, { useState, useEffect } from 'react';
import { tournamentService } from '../../../services/tournamentService';
import { categoryService } from '../../../services/categoryService';
import { teamService } from '../../../services/teamService'; // Importación esencial
import { TorneoIn, CategoriaOut, CompeticionOut } from '../../../types/api';

interface EditTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTournamentUpdated: () => void;
  competicionToEdit: CompeticionOut | null;
}

const EditTournamentModal: React.FC<EditTournamentModalProps> = ({ isOpen, onClose, onTournamentUpdated, competicionToEdit }) => {
  const [nombre, setNombre] = useState('');
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [idCategoria, setIdCategoria] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [availableCategories, setAvailableCategories] = useState<CategoriaOut[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para controlar si hay equipos inscritos
  const [hasEnrolledTeams, setHasEnrolledTeams] = useState(false);

  useEffect(() => {
    if (isOpen && competicionToEdit) {
      setNombre(competicionToEdit.torneo.nombre);
      setAnio(competicionToEdit.torneo.anio);
      setIdCategoria(competicionToEdit.categoria.idCategoria.toString());
      setFechaInicio(competicionToEdit.torneo.fechaInicio);
      setFechaFin(competicionToEdit.torneo.fechaFin);
      setError('');

      // Cargar categorías existentes
      const fetchCategories = async () => {
        try {
          const allCategories = await categoryService.getCategorias();
          setAvailableCategories(allCategories);
        } catch (err) {
          setError('No se pudieron cargar las categorías existentes.');
        }
      };
      fetchCategories();

      // VERIFICACIÓN ESENCIAL: ¿Tiene equipos inscritos?
      teamService.getEquiposByCompeticion(competicionToEdit.idCompeticion)
        .then(equipos => {
          setHasEnrolledTeams(equipos.length > 0);
        })
        .catch(() => setHasEnrolledTeams(false));
    }
  }, [isOpen, competicionToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competicionToEdit) return;

    setIsLoading(true);
    setError('');

    try {
      const apiCalls = [];

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

      if (idCategoria && parseInt(idCategoria) !== competicionToEdit.categoria.idCategoria) {
        apiCalls.push(tournamentService.patchCompeticion(competicionToEdit.idCompeticion, { idCategoria: parseInt(idCategoria) }));
      }

      if (apiCalls.length === 0) {
        setError("No se detectaron cambios para actualizar.");
        setIsLoading(false);
        return;
      }

      await Promise.all(apiCalls);
      onTournamentUpdated();
      onClose();

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
            <label className="block text-sm font-medium text-gray-300">
                Categoría {hasEnrolledTeams && <span className="text-yellow-500 text-xs">(Bloqueada por equipos inscritos)</span>}
            </label>
            <select
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              disabled={hasEnrolledTeams} // BLOQUEO
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="" disabled>Selecciona una categoría</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                  Fecha de Inicio {hasEnrolledTeams && <span className="text-yellow-500 text-xs">(🔒)</span>}
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                disabled={hasEnrolledTeams} // BLOQUEO
                className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fecha de Fin</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {hasEnrolledTeams && (
            <p className="text-[10px] text-yellow-500 italic text-center">
              * Para cambiar la categoría o la fecha de inicio, primero debes desinscribir a los equipos de esta competición.
            </p>
          )}

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