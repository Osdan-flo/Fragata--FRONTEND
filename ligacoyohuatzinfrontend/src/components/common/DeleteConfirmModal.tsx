import React, { useState, useEffect } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading: boolean;
  // CAMBIO 1: Añadimos 'equipo' a los tipos permitidos
  itemType: 'categoria' | 'competicion' | 'equipo';
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading,
  itemType
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const isConfirmed = inputValue === itemName;

  const messages = {
    categoria: {
      title: "Confirmar Eliminación de Categoría",
      warning: (
        <>
          Estás a punto de eliminar permanentemente la categoría <strong className="font-bold text-yellow-400">{itemName}</strong>.
          <br/><br/>
          Esta acción <strong className="text-red-500">solo tendrá éxito si la categoría no tiene competiciones asociadas</strong>.
        </>
      ),
      buttonText: "Sí, eliminar esta categoría"
    },
    competicion: {
      title: "Confirmar Eliminación de Competición",
      warning: (
        <>
          Estás a punto de eliminar la competición <strong className="font-bold text-yellow-400">{itemName}</strong>.
          <br/><br/>
          Si esta es la última competición de su torneo, <strong className="text-red-500">el torneo principal también será eliminado</strong>.
        </>
      ),
      buttonText: "Sí, eliminar esta competición"
    },
    // CAMBIO 2: Añadimos el nuevo bloque de mensajes para 'equipo'
    equipo: {
        title: "Confirmar Eliminación de Equipo",
        warning: (
          <>
            Estás a punto de eliminar permanentemente al equipo <strong className="font-bold text-yellow-400">{itemName}</strong>.
            <br/><br/>
            Esta acción <strong className="text-red-500">solo tendrá éxito si el equipo no está inscrito en ninguna competición activa</strong>.
          </>
        ),
        buttonText: "Sí, eliminar este equipo"
      }
  };

  const currentMessages = messages[itemType];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 bg-opacity-95 text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-4">{currentMessages.title}</h2>
        <p className="text-gray-300 text-center mb-6">{currentMessages.warning}</p>

        <div className="space-y-4">
          <label htmlFor="confirmInput" className="block text-sm font-medium text-gray-300">
            Para confirmar, por favor escribe "<strong className="text-yellow-400">{itemName}</strong>":
          </label>
          <input
            id="confirmInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            autoComplete="off"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button type="button" onClick={onClose} disabled={isLoading} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-4 disabled:opacity-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isConfirmed || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Eliminando...' : currentMessages.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;