import React, { useState, useEffect } from 'react';
import { categoryService } from '../../../services/categoryService';
import { CategoriaIn, CategoriaOut } from '../../../types/api';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void;
  categoryToEdit: CategoriaOut | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, onCategoryUpdated, categoryToEdit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [asciendeAId, setAsciendeAId] = useState<string>('');
  const [desciendeDesdeId, setDesciendeDesdeId] = useState<string>('');

  const [availableCategories, setAvailableCategories] = useState<CategoriaOut[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para cargar los datos de la categoría en el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && categoryToEdit) {
      // Cargar datos en el estado del formulario
      setNombre(categoryToEdit.nombre);
      setDescripcion(categoryToEdit.descripcion || '');
      setAsciendeAId(categoryToEdit.asciendeA?.id.toString() || '');
      setDesciendeDesdeId(categoryToEdit.desciendeDesde?.id.toString() || '');
      setError(''); // Limpiar errores previos

      // Cargar la lista de categorías para los menús desplegables
      const fetchCategories = async () => {
        try {
          const allCategories = await categoryService.getCategorias();
          // Filtramos la categoría actual de la lista para que no pueda ascender/descender a sí misma
          setAvailableCategories(allCategories.filter(c => c.id !== categoryToEdit.id));
        } catch (err) {
          setError('No se pudieron cargar las categorías existentes.');
        }
      };
      fetchCategories();
    }
  }, [isOpen, categoryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryToEdit) return;

    setIsLoading(true);
    setError('');

    // El DTO ahora puede tener campos parciales
    const patchData: Partial<CategoriaIn> = {
      nombre,
      descripcion: descripcion || undefined,
      asciendeAId: asciendeAId ? parseInt(asciendeAId) : undefined,
      desciendeDesdeId: desciendeDesdeId ? parseInt(desciendeDesdeId) : undefined,
    };

    try {
      await categoryService.patchCategoria(categoryToEdit.id, patchData);
      onCategoryUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in"
        style={{ backgroundColor: '#21304e' }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-600 pb-4">Actualizar Categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre-edit" className="block text-sm font-medium text-gray-300">Nombre de la Categoría</label>
            <input
              id="nombre-edit" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="descripcion-edit" className="block text-sm font-medium text-gray-300">Descripción (Opcional)</label>
            <textarea
              id="descripcion-edit" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="asciendeA-edit" className="block text-sm font-medium text-gray-300">Asciende a:</label>
            <select id="asciendeA-edit" value={asciendeAId} onChange={(e) => setAsciendeAId(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Ninguna</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="desciendeDesde-edit" className="block text-sm font-medium text-gray-300">Recibe descensos de:</label>
            <select id="desciendeDesde-edit" value={desciendeDesdeId} onChange={(e) => setDesciendeDesdeId(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Ninguna</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
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

export default EditCategoryModal;