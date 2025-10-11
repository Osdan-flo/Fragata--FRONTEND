import React, { useState, useEffect } from 'react';
import { tournamentService } from '../services/tournamentService';
import { categoryService } from '../services/categoryService';
import { CompeticionOut, TorneoOut, CategoriaOut, TorneoIn } from '../types/api';
import { useAuth } from '../contexts/AuthContext';
import EditTournamentModal from '../components/features/torneos/EditTournamentModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

// --- Íconos para los botones de acción ---
const EditIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

const TablaDePosiciones = () => {
  const { isAuthenticated } = useAuth();

  // --- ESTADOS UNIFICADOS ---
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [selectedCompeticionId, setSelectedCompeticionId] = useState(''); // <-- Este es el ID de la selección final

  const [years, setYears] = useState<number[]>([]);
  const [categorias, setCategorias] = useState<CategoriaOut[]>([]);
  const [competiciones, setCompeticiones] = useState<CompeticionOut[]>([]);
  const [tournamentDates, setTournamentDates] = useState<string | null>(null);

  // Estados para los modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [competitionToModify, setCompetitionToModify] = useState<CompeticionOut | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFiltersData = () => {
    tournamentService.getAnios().then(setYears);
    setSelectedYear('');
    setCategorias([]);
    setCompeticiones([]);
    setSelectedCompeticionId('');
  };

  useEffect(() => {
    loadFiltersData();
  }, []);

  useEffect(() => {
    setCategorias([]);
    setSelectedCategoriaId('');
    if (selectedYear) {
      categoryService.getCategoriasByAnio(parseInt(selectedYear)).then(setCategorias);
    }
  }, [selectedYear]);

  useEffect(() => {
    setCompeticiones([]);
    setSelectedCompeticionId('');
    if (selectedYear && selectedCategoriaId) {
      tournamentService.getCompeticionesByAnioAndCategoria(parseInt(selectedYear), parseInt(selectedCategoriaId)).then(setCompeticiones);
    }
  }, [selectedYear, selectedCategoriaId]);

  // --- LÓGICA DE FECHAS CORREGIDA ---
  // Se activa cuando la lista de competiciones cambia o cuando se selecciona una
  useEffect(() => {
    if (selectedCompeticionId) {
      const selectedComp = competiciones.find(c => c.idCompeticion.toString() === selectedCompeticionId);
      if (selectedComp?.torneo?.fechaInicio && selectedComp?.torneo?.fechaFin) {
        const startDate = new Date(selectedComp.torneo.fechaInicio.replace(/-/g, '/'));
        const endDate = new Date(selectedComp.torneo.fechaFin.replace(/-/g, '/'));
        const formattedDates = `${startDate.toLocaleDateString('es-MX')} - ${endDate.toLocaleDateString('es-MX')}`;
        setTournamentDates(formattedDates);
      }
    } else {
      setTournamentDates(null);
    }
  }, [selectedCompeticionId, competiciones]);

  const selectedCompeticion = competiciones.find(c => c.idCompeticion.toString() === selectedCompeticionId);

  const handleEditClick = (competicion: CompeticionOut) => {
    setCompetitionToModify(competicion);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (competicion: CompeticionOut) => {
    setCompetitionToModify(competicion);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!competitionToModify) return;
    setIsDeleting(true);
    try {
      await tournamentService.deleteCompeticion(competitionToModify.idCompeticion);
      loadFiltersData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'No se pudo eliminar la competición.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* --- COLUMNA IZQUIERDA (ocupa 2 de 3 columnas) --- */}
      <div className="md:col-span-2">

        {/* ==================================================================== */}
        {/* CAMBIO: BARRA DE CONTROL UNIFICADA (TÍTULO + FILTROS)              */}
        {/* ==================================================================== */}
        <div className="bg-black bg-opacity-30 rounded-lg shadow-lg px-6 py-4 flex items-center justify-between mb-8">
          {/* Lado Izquierdo: Título */}
          <h2 className="text-2xl font-bold text-white uppercase">Tabla de Posiciones</h2>

          {/* Lado Derecho: Filtros y Fechas */}
          <div className="flex items-center space-x-4">
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none">
              <option value="">Año</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>

            <select value={selectedCategoriaId} onChange={(e) => setSelectedCategoriaId(e.target.value)} className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none" disabled={!selectedYear}>
              <option value="">Categoría</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>

            <select value={selectedCompeticionId} onChange={(e) => setSelectedCompeticionId(e.target.value)} className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none" disabled={!selectedCategoriaId}>
              <option value="">Torneo</option>
              {competiciones.map(comp => <option key={comp.idCompeticion} value={comp.idCompeticion}>{comp.torneo.nombre}</option>)}
            </select>
          </div>
        </div>

        {/* --- ÁREA DE CONTENIDO PRINCIPAL (Tabla) --- */}
        <div className="text-gray-400">
          {selectedCompeticionId && selectedCompeticion ? (
            <div>
              <div className="flex justify-between items-center bg-black bg-opacity-20 p-4 rounded-t-lg">
                <div className="flex items-center space-x-4">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCompeticion.torneo.nombre} - {selectedCompeticion.categoria.nombre} ({selectedCompeticion.torneo.anio})
                  </h3>
                  {/* CAMBIO: Fechas ahora aparecen junto al título de la tabla */}
                  {tournamentDates && (
                    <span className="text-gray-400 text-sm pt-1">({tournamentDates})</span>
                  )}
                </div>
                {isAuthenticated && (
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleEditClick(selectedCompeticion)} className="text-white hover:text-blue-400" title="Editar Competición">
                      <EditIcon />
                    </button>
                    <button onClick={() => handleDeleteClick(selectedCompeticion)} className="text-white hover:text-red-500" title="Eliminar Competición">
                      <DeleteIcon />
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white bg-opacity-5 p-6 rounded-b-lg">
                <p>Contenido de la tabla de posiciones...</p>
              </div>
            </div>
          ) : (
            <div className="text-center mt-20 bg-black bg-opacity-20 rounded-lg py-10">
              <p>Selecciona un año, categoría y torneo para ver las posiciones.</p>
            </div>
          )}
        </div>
      </div>

      <EditTournamentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTournamentUpdated={() => {
          setIsEditModalOpen(false);
          loadFiltersData();
        }}
        competicionToEdit={competitionToModify}
      />

      {competitionToModify && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={`${competitionToModify.torneo.nombre} - ${competitionToModify.categoria.nombre}`}
          isLoading={isDeleting}
          itemType="competicion"
        />
      )}
      {/* --- COLUMNA DERECHA / BARRA LATERAL (ocupa 1 de 3 columnas) --- */}
      <aside className="md:col-span-1 space-y-8">
        {/* Tarjeta de Goleadores */}
        <div className="bg-black bg-opacity-30 rounded-lg shadow-lg p-4">
          <h3 className="text-white font-bold text-center mb-4 border-b-2 border-green-800 pb-2 uppercase">Goleadores</h3>
          <div className="text-gray-300 text-center">
            <p>Datos de goleadores próximamente...</p>
          </div>
        </div>

        {/* Tarjeta de Tarjetas Amarillas */}
        <div className="bg-black bg-opacity-30 rounded-lg shadow-lg p-4">
          <h3 className="text-white font-bold text-center mb-4 border-b-2 border-green-800 pb-2 uppercase">Tarjetas Amarillas</h3>
          <div className="text-gray-300 text-center">
            <p>Datos de tarjetas próximamente...</p>
          </div>
        </div>

        {/* Tarjeta de Tarjetas Rojas */}
        <div className="bg-black bg-opacity-30 rounded-lg shadow-lg p-4">
          <h3 className="text-white font-bold text-center mb-4 border-b-2 border-green-800 pb-2 uppercase">Tarjetas Rojas</h3>
          <div className="text-gray-300 text-center">
            <p>Datos de tarjetas próximamente...</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TablaDePosiciones;