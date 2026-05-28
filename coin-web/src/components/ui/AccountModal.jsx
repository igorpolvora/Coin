import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const presetColors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#06B6D4', '#14B8A6'];

const AccountModal = ({ isOpen, onClose, accountToEdit = null }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    type: 'CHECKING',
    balance: '',
    color: '#3B82F6',
    isVault: false
  });

  useEffect(() => {
    if (accountToEdit) {
      setFormData({
        name: accountToEdit.name || '',
        type: accountToEdit.type || 'CHECKING',
        balance: accountToEdit.balance || '',
        color: accountToEdit.color || '#3B82F6',
        isVault: accountToEdit.isVault || false
      });
    } else {
      setFormData({
        name: '',
        type: 'CHECKING',
        balance: '',
        color: '#3B82F6',
        isVault: false
      });
    }
  }, [accountToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (accountToEdit) {
        return api.put(`/accounts/${accountToEdit.id}`, data);
      }
      return api.post('/accounts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['dashboardSummary']);
      toast.success(accountToEdit ? 'Conta atualizada!' : 'Conta criada com sucesso!');
      onClose();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.balance === '') {
      toast.error('Nome e saldo inicial são obrigatórios');
      return;
    }

    const payload = {
      ...formData,
      balance: parseFloat(formData.balance)
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {accountToEdit ? 'Editar Conta' : 'Nova Conta'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <form id="account-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Instituição *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="CHECKING">Corrente</option>
                  <option value="SAVINGS">Poupança</option>
                  <option value="WALLET">Carteira</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Atual *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  />
                </div>
              </div>
            </div>

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

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isVault"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.isVault}
                onChange={(e) => setFormData({ ...formData, isVault: e.target.checked })}
              />
              <label htmlFor="isVault" className="ml-2 block text-sm text-gray-900">
                Usar como Cofre (Separar do Saldo Principal)
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
            form="account-form"
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

export default AccountModal;
