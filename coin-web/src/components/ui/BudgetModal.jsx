import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useCategories } from '../../hooks/useCategories';

const BudgetModal = ({ isOpen, onClose, budgetToEdit = null, currentMonth, currentYear }) => {
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState({
    categoryId: '',
    amountLimit: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (budgetToEdit) {
      setFormData({
        categoryId: budgetToEdit.category?.id || '',
        amountLimit: budgetToEdit.amountLimit || ''
      });
    } else {
      setFormData({
        categoryId: '',
        amountLimit: ''
      });
    }
    setError('');
  }, [budgetToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (budgetToEdit) {
        return api.put(`/budgets/${budgetToEdit.id}`, data);
      }
      return api.post('/budgets', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Erro ao salvar orçamento. Verifique se a categoria já possui um orçamento neste mês.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId || !formData.amountLimit) {
      setError('Selecione uma categoria e informe o limite.');
      return;
    }

    const payload = {
      categoryId: parseInt(formData.categoryId),
      amountLimit: parseFloat(formData.amountLimit),
      month: currentMonth,
      year: currentYear
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {budgetToEdit ? 'Editar Orçamento' : 'Definir Limite'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Definindo orçamento para {String(currentMonth).padStart(2, '0')}/{currentYear}.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form id="budget-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white disabled:opacity-50"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                disabled={!!budgetToEdit} // Disable changing category when editing
              >
                <option value="">Selecione...</option>
                {expenseCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limite Máximo (R$) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-medium">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-semibold"
                  placeholder="0.00"
                  value={formData.amountLimit}
                  onChange={(e) => setFormData({ ...formData, amountLimit: e.target.value })}
                />
              </div>
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
            form="budget-form"
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

export default BudgetModal;
