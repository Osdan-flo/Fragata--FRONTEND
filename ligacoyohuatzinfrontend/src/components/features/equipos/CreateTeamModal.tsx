import React, { useState, useEffect } from 'react';
import { teamService } from '../../../services/teamService';
import { tournamentService } from '../../../services/tournamentService';
import { categoryService } from '../../../services/categoryService';
import { CategoriaOut, CompeticionOut, CreateEquipoIn } from '../../../types/api';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onTeamCreated }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [selectedCompeticionId, setSelectedCompeticionId] = useState('');

  const [categorias, setCategorias] = useState<CategoriaOut[]>([]);
  const [competiciones, setCompeticiones] = useState<CompeticionOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar las categorías base al abrir el modal
  useEffect(() => {
    if (isOpen) {
      // Limpieza del formulario
      setNombre(''); setDescripcion(''); setLogo(null);
      setSelectedCategoriaId(''); setSelectedCompeticionId(''); setError('');

      categoryService.getCategorias().then(setCategorias).catch(() => {
        setError('No se pudieron cargar las categorías.');
      });
    }
  }, [isOpen]);

  // Cargar las competiciones disponibles cuando el usuario selecciona una categoría
  useEffect(() => {
    setCompeticiones([]);
    setSelectedCompeticionId('');
    if (selectedCategoriaId) {
      tournamentService.getCompeticionesByCategoria(parseInt(selectedCategoriaId))
        .then(setCompeticiones)
        .catch(() => {
          // No mostramos error aquí, puede que simplemente no haya torneos para esa categoría
          console.warn('No se encontraron torneos para la categoría seleccionada.');
        });
    }
  }, [selectedCategoriaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData();

    const data: CreateEquipoIn = {
        nombre: nombre,
        descripcion: descripcion,
        categoriaBaseId: parseInt(selectedCategoriaId)
    };
    const dataBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', dataBlob);

    if (logo) {
      formData.append('logo', logo);
    }

    try {
      // 1. Crear el equipo (con su categoría base)
      const equipoCreado = await teamService.createEquipo(formData);

      // 2. Si se seleccionó una competición, inscribir al equipo
      if (selectedCompeticionId) {
        await teamService.inscribirEquipoACompeticion({
          idEquipo: equipoCreado.id,
          idCompeticion: parseInt(selectedCompeticionId)
        });
      }

      onTeamCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear el equipo.');
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
        <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-600 pb-4">Constructor de Equipo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Ingresa el nombre del nuevo equipo:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nombre del Equipo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Descripción (Opcional):</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Historia, colores, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Selecciona la categoría del equipo:</label>
            <select value={selectedCategoriaId} onChange={(e) => setSelectedCategoriaId(e.target.value)} required
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="" disabled>-- Obligatorio --</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Inscribir a un torneo (Opcional):</label>
            <select value={selectedCompeticionId} onChange={(e) => setSelectedCompeticionId(e.target.value)}
              disabled={!selectedCategoriaId || competiciones.length === 0} // Deshabilitado si no hay categoría o no hay torneos
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50">
              <option value="">Ninguna</option>
              {competiciones.map(comp => {
                const esPasada = comp.torneo.fechaFin < new Date().toISOString().slice(0, 10);
                return (
                  <option
                    key={comp.idCompeticion}
                    value={comp.idCompeticion}
                    disabled={esPasada}
                    style={esPasada ? { color: '#9CA3AF' } : undefined}
                    title={esPasada ? 'Esta competición ya no es elegible: su torneo ya terminó y ahora forma parte del registro histórico, visible en el apartado de Torneos.' : undefined}
                  >
                    {comp.torneo.nombre} ({comp.torneo.anio}){esPasada ? ' — Competición pasada' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Logo del equipo (opcional):</label>
            <input type="file" onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
              className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-600"
              accept="image/*" />
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-4">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
              {isLoading ? 'Creando...' : 'CREAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;