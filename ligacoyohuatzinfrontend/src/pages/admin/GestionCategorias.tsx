import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { categoryService } from '../../services/categoryService';
import { CategoriaOut } from '../../types/api';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import EditCategoryModal from '../../components/features/categorias/EditCategoryModal'; // <-- Importamos el modal de edición

// Íconos SVG para las acciones (sin cambios)
const EditIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ExpandIcon = ({ isExpanded }: { isExpanded: boolean }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

const GestionCategorias = () => {
  const { isAuthenticated } = useAuth();
  const [categorias, setCategorias] = useState<CategoriaOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // --- 2. Nuevos estados para manejar el modal de eliminación ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoriaOut | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Estados para el modal de EDICIÓN ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoriaOut | null>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await categoryService.getCategorias();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. Lógica para el modal de eliminación ---
  const handleDeleteClick = (category: CategoriaOut) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (category: CategoriaOut) => {
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategoria(categoryToDelete.id);
      loadCategorias();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'No se pudo eliminar la categoría.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleExpand = (id: number) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  return (
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white uppercase">Bienvenido a las CATEGORÍAS</h2>
          <p className="text-gray-300 mt-4 max-w-3xl mx-auto">
            En esta sección podrás encontrar información sobre tu categoría favorita, podrás consultar los equipos que forman parte de cada categoría, así como los jugadores que juegan en cada uno junto con su información de registro, así como la información del entrenador que los dirige. ¡Disfrútalo!
          </p>
        </div>

        {isLoading && <p className="text-center text-white">Cargando categorías...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-4 max-w-6xl mx-auto">
          {categorias.map(cat => {
            // --- Lógica para el Indicador Visual ---
            const isExpanded = expandedId === cat.id;
            const isLibreFamily = cat.nombre.toLowerCase().includes('libre');
            const needsAscenso = cat.nombre.toLowerCase().includes('d.a') && !cat.asciendeA;
            const needsDescenso = isLibreFamily && !cat.nombre.toLowerCase().includes('d.a') && !cat.desciendeDesde;
            const needsAttention = needsAscenso || needsDescenso;
            const tooltipText = needsAscenso ? 'Falta definir la categoría de ascenso' : 'Falta definir la categoría de descenso';

            return (
              <div key={cat.id}>
                {/* Botón principal (Tu diseño original) */}
                <div
                  className={`bg-black bg-opacity-30 shadow-lg px-6 py-6 flex items-center justify-between transition-all duration-300 ${
                    expandedId === cat.id && cat.descripcion
                      ? 'rounded-t-full'
                      : 'rounded-full'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleExpand(cat.id)}
                      className="text-white hover:text-green-300 disabled:opacity-30"
                      disabled={!cat.descripcion}
                    >
                      <ExpandIcon isExpanded={isExpanded} />
                    </button>
                    <span className="text-white font-semibold text-xl tracking-wider">
                      {cat.nombre.toUpperCase()}
                    </span>

                    {/* --- AÑADIDO: Renderizado del Indicador Visual --- */}
                    {isAuthenticated && needsAttention && (
                      <span title={tooltipText}>
                        <WarningIcon />
                      </span>
                    )}
                  </div>
                  {isAuthenticated && (
                    <div className="flex items-center space-x-4">
                      {/* --- AÑADIDO: onClick para el botón de editar --- */}
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="text-white hover:text-blue-400"
                        title="Editar"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat)}
                        className="text-white hover:text-red-500"
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  )}
                </div>

                {/* Rectángulo con la descripción (Tu animación original) */}
                <div
                  className={`bg-black bg-opacity-30 shadow-lg overflow-hidden transition-all duration-300 ${
                    isExpanded && cat.descripcion
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4">
                    <p className="text-gray-300">{cat.descripcion}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal de confirmación para eliminar */}
        {categoryToDelete && (
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            itemName={categoryToDelete.nombre}
            isLoading={isDeleting}
            itemType="categoria"
          />
        )}

        {/* --- AÑADIDO: Renderizado del modal de edición --- */}
        {isAuthenticated && (
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onCategoryUpdated={loadCategorias}
            categoryToEdit={categoryToEdit}
          />
        )}
      </div>
    );
};
export default GestionCategorias;