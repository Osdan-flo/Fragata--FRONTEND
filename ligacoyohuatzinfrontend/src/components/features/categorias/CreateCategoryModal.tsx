import React, { useState, useEffect } from 'react';
import { categoryService } from '../../../services/categoryService';
import { CategoriaIn, CategoriaOut } from '../../../types/api';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: () => void; // Para refrescar la lista
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onCategoryCreated }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [asciendeAId, setAsciendeAId] = useState<string>('');
  const [desciendeDesdeId, setDesciendeDesdeId] = useState<string>('');

  const [availableCategories, setAvailableCategories] = useState<CategoriaOut[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Carga las categorías existentes para los menús desplegables cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const categories = await categoryService.getCategorias();
          setAvailableCategories(categories);
        } catch (err) {
          setError('No se pudieron cargar las categorías existentes.');
        }
      };
      fetchCategories();

      // Limpia el formulario cada vez que se abre
      setNombre('');
      setDescripcion('');
      setAsciendeAId('');
      setDesciendeDesdeId('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const newCategory: CategoriaIn = {
      nombre,
      descripcion: descripcion || undefined, // Envía undefined si está vacío
      asciendeAId: asciendeAId ? parseInt(asciendeAId) : undefined,
      desciendeDesdeId: desciendeDesdeId ? parseInt(desciendeDesdeId) : undefined,
    };

    try {
      await categoryService.createCategoria(newCategory);
      onCategoryCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la categoría');
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
        <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-600 pb-4">Constructor de Categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">Nombre de la Categoría</label>
            <input
              id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Infantil" required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300">Descripción (Opcional)</label>
            <textarea
              id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Para niños de 8 a 10 años"
            />
          </div>

          <div>
            <label htmlFor="asciendeA" className="block text-sm font-medium text-gray-300">¿Asciende a alguna categoría?</label>
            <select id="asciendeA" value={asciendeAId} onChange={(e) => setAsciendeAId(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Ninguna</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="desciendeDesde" className="block text-sm font-medium text-gray-300">¿Recibe descensos de alguna categoría?</label>
            <select id="desciendeDesde" value={desciendeDesdeId} onChange={(e) => setDesciendeDesdeId(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Ninguna</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-8 flex justify-end">
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

export default CreateCategoryModal;