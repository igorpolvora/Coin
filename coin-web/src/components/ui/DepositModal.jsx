import React, { useState } from 'react';
import { X, ArrowDownCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const DepositModal = ({ isOpen, onClose, goal = null }) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data) => {
      return api.post(`/savings-goals/${goal.id}/deposit`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      queryClient.invalidateQueries(['dashboardSummary']);
      setAmount('');
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Erro ao realizar depósito');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError('Insira um valor válido para depositar.');
      return;
    }

    mutation.mutate({ amount: value });
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ArrowDownCircle className="w-5 h-5 mr-2 text-green-500" />
            Depositar
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Adicionando saldo para a meta <strong className="text-gray-900">{goal.name}</strong>.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form id="deposit-form" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Depósito</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-medium">R$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                autoFocus
                className="w-full pl-10 pr-3 py-2 text-lg font-semibold border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
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
            form="deposit-form"
            disabled={mutation.isPending}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? 'Processando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
