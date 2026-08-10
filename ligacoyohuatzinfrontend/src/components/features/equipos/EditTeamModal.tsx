import React, { useState, useEffect } from 'react';
import { teamService } from '../../../services/teamService';
import { categoryService } from '../../../services/categoryService';
import { tournamentService } from '../../../services/tournamentService';
import { EquipoOut, CategoriaOut, UpdateEquipoIn, CompeticionOut } from '../../../types/api';

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated: () => void;
  equipoToEdit: EquipoOut | null;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({ isOpen, onClose, onTeamUpdated, equipoToEdit }) => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [selectedCompeticionId, setSelectedCompeticionId] = useState('');

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaOut[]>([]);
  const [competiciones, setCompeticiones] = useState<CompeticionOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mini-modal de "distintivo": aparece si al cambiar de categoría (ascenso/descenso) ya
  // existe otro equipo con el mismo nombre en la categoría destino.
  const [showDistintivoModal, setShowDistintivoModal] = useState(false);
  const [nombreDistintivo, setNombreDistintivo] = useState('');

  // Carga los datos del equipo en el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && equipoToEdit) {
      setNombre(equipoToEdit.nombre);
      setDescripcion(equipoToEdit.descripcion || '');
      setSelectedCategoriaId(equipoToEdit.categoriaBase?.idCategoria.toString() || '');
      setSelectedCompeticionId('');
      setLogo(null);
      setError('');

      const enrolled = (equipoToEdit.competicionesInscritas?.length || 0) > 0;
      setIsEnrolled(enrolled);

      // Carga la lista de categorías para el menú desplegable
      categoryService.getCategorias().then(setCategorias);
    }
  }, [isOpen, equipoToEdit]);

  // Cargar competiciones cuando cambia la categoría (para el 2do desplegable)
  useEffect(() => {
    setCompeticiones([]);
    setSelectedCompeticionId('');
    if (selectedCategoriaId) {
      tournamentService
        .getCompeticionesByCategoria(parseInt(selectedCategoriaId))
        .then(setCompeticiones)
        .catch(() => console.warn('No se encontraron torneos para la categoría seleccionada.'));
    }
  }, [selectedCategoriaId]);



  // nombreOverride se usa cuando el admin resuelve un choque de nombre desde el
  // mini-modal de distintivo y reintenta con el nombre ya diferenciado.
  const submitUpdate = async (nombreOverride?: string) => {
    if (!equipoToEdit) return;

    const nombreFinal = (nombreOverride ?? nombre).trim();

    // 1. Llamada Inteligente: comparar contra los datos originales para no
    // disparar un PATCH innecesario (el backend rechaza updates sin cambios reales).
    const nombreCambiado = nombreFinal !== equipoToEdit.nombre;
    const descripcionCambiada = descripcion !== (equipoToEdit.descripcion || '');
    const categoriaCambiada =
      selectedCategoriaId !== '' &&
      parseInt(selectedCategoriaId, 10) !== equipoToEdit.categoriaBase?.idCategoria;
    const logoCambiado = logo !== null;
    const datosCambiaron = nombreCambiado || descripcionCambiada || categoriaCambiada || logoCambiado;

    if (!datosCambiaron && !selectedCompeticionId) {
      setError('No se detectaron cambios para actualizar.');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Actualizar el equipo (PATCH) solo si hubo cambios reales
      if (datosCambiaron) {
        const data = {
          nombreEquipo: nombreFinal,
          descripcionEquipo: descripcion,
          categoriaBaseId: selectedCategoriaId ? parseInt(selectedCategoriaId, 10) : null,
        };

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (logo) {
          formData.append('logo', logo);
        }

        await teamService.patchEquipo(equipoToEdit.id, formData);
      }

      // 3. Inscribir a una nueva competición si se seleccionó una — independiente del PATCH
      if (selectedCompeticionId) {
        await teamService.inscribirEquipoACompeticion({
          idEquipo: equipoToEdit.id,
          idCompeticion: parseInt(selectedCompeticionId)
        });
      }

      onTeamUpdated();
      onClose();
    } catch (err: any) {
      // Si el choque es por nombre duplicado justo al cambiar de categoría (ascenso/descenso
      // hacia una categoría donde ya hay un equipo homónimo), ofrecemos resolverlo con un
      // nombre distintivo en vez de solo mostrar el error.
      if (err.response?.status === 409 && categoriaCambiada) {
        setNombreDistintivo(`${nombreFinal} (${categorias.find(c => c.id === parseInt(selectedCategoriaId, 10))?.nombre ?? 'nueva categoría'})`);
        setShowDistintivoModal(true);
      } else {
        setError(err.response?.data?.error || 'Error al actualizar el equipo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await submitUpdate();
  };

  const handleConfirmDistintivo = async () => {
    if (!nombreDistintivo.trim()) return;
    setShowDistintivoModal(false);
    setIsLoading(true);
    setError('');
    await submitUpdate(nombreDistintivo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 bg-opacity-95 text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-600 pb-4">Actualizar Equipo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre del equipo:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Categoría base del equipo:</label>
            <select value={selectedCategoriaId} onChange={(e) => setSelectedCategoriaId(e.target.value)}
              disabled={isEnrolled} // Deshabilitado si ya está inscrito
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="" disabled>Selecciona una categoría</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Inscribir a un nuevo torneo (Opcional):</label>
            <select value={selectedCompeticionId} onChange={(e) => setSelectedCompeticionId(e.target.value)}
              disabled={isEnrolled || !selectedCategoriaId || competiciones.length === 0} // Deshabilitado si está inscrito o no hay categoría
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
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
          {/* Mensaje de advertencia si está inscrito */}
          {isEnrolled && (
            <p className="text-xs text-yellow-400 text-center">
              Para cambiar la categoría o inscribir a un nuevo torneo, primero debes desinscribir a este equipo de todas sus competiciones actuales (usando el botón ❌ en la lista de equipos).
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300">Cambiar logo (opcional):</label>
            <input type="file" onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
              className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-600"
              accept="image/*" />
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-4">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Mini-modal de distintivo: se muestra encima cuando el ascenso/descenso de categoría
          choca con un equipo homónimo ya existente en la categoría destino. */}
      {showDistintivoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="bg-gray-800 border border-yellow-600 text-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">⚠️ Ya existe un equipo con ese nombre</h3>
            <p className="text-sm text-gray-300 mb-4">
              En la categoría destino ya hay un equipo llamado "{nombre.trim()}". Ingresa un nombre distintivo para diferenciarlos (por ejemplo, agregando la categoría o un identificador).
            </p>
            <input
              type="text"
              value={nombreDistintivo}
              onChange={(e) => setNombreDistintivo(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              autoFocus
            />
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDistintivoModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDistintivo}
                disabled={!nombreDistintivo.trim() || isLoading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Usar este nombre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTeamModal;