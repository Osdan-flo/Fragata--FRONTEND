import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { teamService } from '../services/teamService';
import { tournamentService } from '../services/tournamentService';
import { EquipoOut, CompeticionOut } from '../types/api';
import { useAuth } from '../contexts/AuthContext';
import EditTeamModal from '../components/features/equipos/EditTeamModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

// --- Íconos SVG para las acciones ---
const EditIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ExpandIcon = ({ isExpanded }: { isExpanded: boolean }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>;
// --- NUEVO ÍCONO PARA DESINSCRIBIR ---
const UnenrollIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 hover:text-red-700"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- Componente para la Palomita Dorada ---
const GoldenCheckmark = ({ tooltipText }: { tooltipText: string }) => (
  <div className="relative group flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gold" className="text-yellow-400">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {tooltipText}
    </div>
  </div>
);

const EquiposPorCategoria = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [equipos, setEquipos] = useState<EquipoOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToModify, setTeamToModify] = useState<EquipoOut | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Estado para la inscripción masiva ("dar la palomita a todos") ---
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCompeticiones, setBulkCompeticiones] = useState<CompeticionOut[]>([]);
  const [selectedBulkCompeticionId, setSelectedBulkCompeticionId] = useState('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkError, setBulkError] = useState('');

  const categoryName = location.state?.categoryName || 'Categoría';

  const loadEquipos = () => {
    if (categoryId) {
      setIsLoading(true);
      teamService.getEquiposByCategoria(parseInt(categoryId))
        .then(setEquipos)
        .catch(() => setError('No se pudieron cargar los equipos.'))
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    loadEquipos();
  }, [categoryId]);

  const handleEditClick = (equipo: EquipoOut) => {
    setTeamToModify(equipo);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (equipo: EquipoOut) => {
    setTeamToModify(equipo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!teamToModify) return;
    setIsDeleting(true);
    try {
      await teamService.deleteEquipo(teamToModify.id);
      loadEquipos(); // Recarga la lista
    } catch (err: any) {
      alert(err.response?.data?.error || 'No se pudo eliminar el equipo.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleToggleExpand = (id: number) => {
      setExpandedId(prevId => (prevId === id ? null : id));
  };

  const handleUnenroll = async (equipoId: number, equipoNombre: string) => {
      if (window.confirm(`¿Estás seguro de que quieres desinscribir al equipo "${equipoNombre}" de todas sus competiciones?`)) {
        try {
          await teamService.desinscribirEquipoDeTodo(equipoId); // Necesitarás añadir esta función al service
          loadEquipos(); // Recarga la lista para que cambie el botón
        } catch (err: any) {
          alert(err.response?.data?.error || 'No se pudo desinscribir al equipo.');
        }
      }
  };

  const handleOpenBulkModal = async () => {
    if (!categoryId) return;
    setBulkError('');
    setSelectedBulkCompeticionId('');
    setIsBulkModalOpen(true);
    try {
      const data = await tournamentService.getCompeticionesByCategoria(parseInt(categoryId));
      setBulkCompeticiones(data);
    } catch {
      setBulkError('No se pudieron cargar las competiciones de esta categoría.');
    }
  };

  const handleConfirmBulkEnroll = async () => {
    if (!selectedBulkCompeticionId) return;
    setIsBulkSubmitting(true);
    setBulkError('');

    const idCompeticion = parseInt(selectedBulkCompeticionId);
    const yaInscritos = new Set(
      equipos
        .filter(e => e.competicionesInscritas?.some(c => c.idCompeticion === idCompeticion))
        .map(e => e.id)
    );
    const pendientes = equipos.filter(e => !yaInscritos.has(e.id));

    const resultados = await Promise.allSettled(
      pendientes.map(e => teamService.inscribirEquipoACompeticion({ idEquipo: e.id, idCompeticion }))
    );
    const fallidos = resultados.filter(r => r.status === 'rejected').length;

    setIsBulkSubmitting(false);
    setIsBulkModalOpen(false);
    loadEquipos();

    if (fallidos > 0) {
      alert(`Se inscribieron ${pendientes.length - fallidos} equipo(s). ${fallidos} no se pudieron inscribir (revisa sus datos).`);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white uppercase">Equipos de la Categoría {categoryName}</h2>
        <p className="text-gray-300 mt-4 max-w-3xl mx-auto">
          Aquí podrás ver todos los equipos afiliados a la categoría {categoryName}. Haciendo clic en cada equipo podrás ver a los jugadores inscritos y el mismo entrenador asociado a tal equipo.
        </p>
        {isAuthenticated && equipos.length > 0 && (
          <button
            onClick={handleOpenBulkModal}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-5 rounded-lg text-sm"
          >
            🏅 Inscribir a todos los equipos a una competición
          </button>
        )}
      </div>

      {isLoading && <p className="text-center text-white">Cargando equipos...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto items-start">
              {equipos.map(equipo => {
                const isExpanded = expandedId === equipo.id;
                // Palomita dorada: solo inscripciones VIGENTES (torneo activo + categoría actual).
                const isInscrito = equipo.competicionesInscritas && equipo.competicionesInscritas.length > 0;
                // Botón eliminar/desinscribir: cualquier inscripción histórica, igual que la
                // validación real del backend (EquipoService.deleteEquipo). Si se usara `isInscrito`
                // aquí, una inscripción ya vencida mostraría 🗑️ aunque el backend igual rechace el borrado.
                const tieneInscripciones = equipo.tieneInscripciones ?? isInscrito;

                return (
                  // CAMBIO: Se usa div en lugar de Link para permitir los botones internos
                  <div key={equipo.id} className="bg-black bg-opacity-30 rounded-lg shadow-lg overflow-hidden">
                    {/* Parte principal del botón */}
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleToggleExpand(equipo.id)}
                          className="text-white hover:text-green-300 disabled:opacity-30"
                          disabled={!equipo.descripcion}
                          title={equipo.descripcion ? "Mostrar/Ocultar descripción" : "Sin descripción"}
                        >
                          <ExpandIcon isExpanded={isExpanded} />
                        </button>
                        <img src={equipo.logo || '/images/default-logo.png'} alt={equipo.nombre} className="w-12 h-12 rounded-full object-cover border-2 border-green-800" />
                        <span className="text-white font-semibold text-xl">{equipo.nombre}</span>
                        {isInscrito && (
                          <GoldenCheckmark tooltipText={`Inscrito en: ${equipo.competicionesInscritas?.map(c => `${c.nombreTorneo} ${c.anioTorneo}`).join(', ')}`} />
                        )}
                      </div>
                      {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                          <button onClick={() => handleEditClick(equipo)} className="text-white hover:text-blue-400" title="Editar Equipo"><EditIcon /></button>
                          {/* --- LÓGICA DEL BOTÓN INTELIGENTE ❌ / 🗑️ --- */}
                          {tieneInscripciones ? (
                            <button onClick={() => handleUnenroll(equipo.id, equipo.nombre)} className="text-red-500 hover:text-red-700" title="Desinscribir de todas las competiciones">
                              <UnenrollIcon />
                            </button>
                          ) : (
                            <button onClick={() => handleDeleteClick(equipo)} className="text-white hover:text-red-500" title="Eliminar Equipo">
                              <DeleteIcon />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Contenedor para la descripción con animación */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded && equipo.descripcion ? 'max-h-40' : 'max-h-0'}`}>
                      {equipo.descripcion && (
                        <div className="px-6 pb-4 pt-2 border-t border-green-900 border-opacity-50">
                          <p className="text-gray-300">{equipo.descripcion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

      <EditTeamModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTeamUpdated={() => { setIsEditModalOpen(false); loadEquipos(); }}
        equipoToEdit={teamToModify}
      />

      {teamToModify && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={teamToModify.nombre}
          isLoading={isDeleting}
          itemType="equipo"
        />
      )}

      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-95 text-white rounded-xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">Inscribir a todos los equipos</h3>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Se inscribirá a los {equipos.length} equipo(s) de {categoryName} en la competición que elijas. Los que ya estén inscritos se omiten automáticamente.
            </p>
            <label className="block text-sm font-medium text-gray-300 mb-1">Competición destino:</label>
            <select
              value={selectedBulkCompeticionId}
              onChange={(e) => setSelectedBulkCompeticionId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Selecciona una competición</option>
              {bulkCompeticiones.map(comp => {
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

            {bulkError && <p className="text-red-500 text-sm mt-3 text-center">{bulkError}</p>}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkEnroll}
                disabled={!selectedBulkCompeticionId || isBulkSubmitting}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {isBulkSubmitting ? 'Inscribiendo...' : 'Confirmar inscripción masiva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquiposPorCategoria;