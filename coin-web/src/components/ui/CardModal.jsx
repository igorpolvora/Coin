import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const presetColors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#64748B', '#1E293B'];

const CardModal = ({ isOpen, onClose, cardToEdit = null }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    lastFour: '',
    creditLimit: '',
    dueDay: '',
    closingDay: '',
    color: '#3B82F6'
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (cardToEdit) {
      setFormData({
        name: cardToEdit.name,
        lastFour: cardToEdit.lastFour,
        creditLimit: cardToEdit.creditLimit,
        dueDay: cardToEdit.dueDay,
        closingDay: cardToEdit.closingDay,
        color: cardToEdit.color
      });
    } else {
      setFormData({
        name: '',
        lastFour: '',
        creditLimit: '',
        dueDay: '',
        closingDay: '',
        color: '#3B82F6'
      });
    }
    setError('');
  }, [cardToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (cardToEdit) {
        return api.put(`/cards/${cardToEdit.id}`, data);
      }
      return api.post('/cards', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cards']);
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Erro ao salvar cartão');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.lastFour || !formData.creditLimit || !formData.dueDay || !formData.closingDay) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.lastFour.length !== 4) {
      setError('Os últimos dígitos devem ter exatamente 4 números.');
      return;
    }

    const payload = {
      name: formData.name,
      lastFour: formData.lastFour,
      creditLimit: parseFloat(formData.creditLimit),
      dueDay: parseInt(formData.dueDay),
      closingDay: parseInt(formData.closingDay),
      color: formData.color,
      isActive: true
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {cardToEdit ? 'Editar Cartão' : 'Novo Cartão'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form id="card-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cartão *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Nubank, Itaú"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Últimos 4 Dígitos *</label>
                <input
                  type="text"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="1234"
                  value={formData.lastFour}
                  onChange={(e) => setFormData({ ...formData, lastFour: e.target.value.replace(/\D/g, '') })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limite *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia do Vencimento *</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: 10"
                  value={formData.dueDay}
                  onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia do Fechamento *</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: 3"
                  value={formData.closingDay}
                  onChange={(e) => setFormData({ ...formData, closingDay: e.target.value })}
                />
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Identificação</label>
              <div className="flex flex-wrap gap-3">
                {presetColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="card-form"
            disabled={mutation.isPending}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
