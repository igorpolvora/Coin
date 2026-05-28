import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useCategories } from '../../hooks/useCategories';

const BillModal = ({ isOpen, onClose, billToEdit = null }) => {
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState({
    description: '',
    categoryId: '',
    amount: '',
    dueDay: '',
    autoPay: false
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (billToEdit) {
      setFormData({
        description: billToEdit.description || '',
        categoryId: billToEdit.category?.id || '',
        amount: billToEdit.amount || '',
        dueDay: billToEdit.dueDay || '',
        autoPay: billToEdit.autoPay || false
      });
    } else {
      setFormData({
        description: '',
        categoryId: '',
        amount: '',
        dueDay: '',
        autoPay: false
      });
    }
    setError('');
  }, [billToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (billToEdit) {
        return api.put(`/fixed-bills/${billToEdit.id}`, data);
      }
      return api.post('/fixed-bills', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bills']);
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Erro ao salvar conta fixa.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.description || !formData.categoryId || !formData.amount || !formData.dueDay) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const day = parseInt(formData.dueDay);
    if (day < 1 || day > 31) {
      setError('Dia de vencimento deve ser entre 1 e 31.');
      return;
    }

    const payload = {
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
      amount: parseFloat(formData.amount),
      dueDay: day,
      autoPay: formData.autoPay,
      isActive: true
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {billToEdit ? 'Editar Conta Fixa' : 'Nova Conta Fixa'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form id="bill-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Aluguel"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Vencimento *</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {expenseCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="autoPay"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.autoPay}
                onChange={(e) => setFormData({ ...formData, autoPay: e.target.checked })}
              />
              <label htmlFor="autoPay" className="ml-2 block text-sm text-gray-900">
                Pagamento Automático (Débito em Conta)
              </label>
            </div>
          </form>
        </div>

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
            form="bill-form"
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

export default BillModal;
