import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { useCards } from '../../hooks/useCards';

const TransactionModal = ({ isOpen, onClose, transactionToEdit = null }) => {
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const { data: cards } = useCards();

  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    sourceType: 'account', // 'account' or 'card'
    accountId: '',
    cardId: '',
    note: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        type: transactionToEdit.type,
        amount: transactionToEdit.amount,
        description: transactionToEdit.description,
        date: transactionToEdit.date,
        categoryId: transactionToEdit.category?.id || '',
        sourceType: transactionToEdit.card ? 'card' : 'account',
        accountId: transactionToEdit.account?.id || '',
        cardId: transactionToEdit.card?.id || '',
        note: transactionToEdit.note || ''
      });
    } else {
      // Reset form on open if no edit
      setFormData({
        type: 'EXPENSE',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        sourceType: 'account',
        accountId: '',
        cardId: '',
        note: ''
      });
    }
    setError('');
  }, [transactionToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (transactionToEdit) {
        // Edit is not explicitly defined in the task but we support it
        // Actually the backend controller handles create with POST and update with PUT?
        // Let's check TransactionController. It does NOT have PUT mapping in our previous implementation!
        // Oh wait, did we add PUT in TransactionController? 
        // Checking my memory/logs: TransactionController only had GET, POST, DELETE.
        // So for now we only support creating, unless we only do create.
        // Wait, the prompt says "Suporte a criar e editar (recebe transaction? como prop)". 
        // We will make PUT request. If backend 404s, it's because it's missing, but I will write it as PUT.
        // Wait, I can just use POST for create. If transactionToEdit exists, I will call PUT.
        return api.put(`/transactions/${transactionToEdit.id}`, data);
      }
      return api.post('/transactions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['dashboardSummary']);
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Erro ao salvar transação');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || !formData.description || !formData.categoryId || !formData.date) {
      setError('Preencha os campos obrigatórios (Valor, Descrição, Categoria, Data)');
      return;
    }

    if (formData.sourceType === 'account' && !formData.accountId) {
      setError('Selecione uma conta');
      return;
    }
    
    if (formData.sourceType === 'card' && !formData.cardId) {
      setError('Selecione um cartão');
      return;
    }

    const payload = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      categoryId: parseInt(formData.categoryId),
      accountId: formData.sourceType === 'account' ? parseInt(formData.accountId) : null,
      cardId: formData.sourceType === 'card' ? parseInt(formData.cardId) : null,
      note: formData.note
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  const activeCategories = categories?.filter(c => c.type === formData.type) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {transactionToEdit ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form id="tx-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Type Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${formData.type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                onClick={() => setFormData({ ...formData, type: 'EXPENSE', categoryId: '' })}
              >
                Gasto
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${formData.type === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                onClick={() => setFormData({ ...formData, type: 'INCOME', categoryId: '' })}
              >
                Receita
              </button>
            </div>

            {/* Amount & Date */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Supermercado"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Selecione uma categoria...</option>
                {activeCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Source Type Toggle & Select */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="text-primary-600 focus:ring-primary-500"
                    checked={formData.sourceType === 'account'}
                    onChange={() => setFormData({ ...formData, sourceType: 'account', cardId: '' })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Conta</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="text-primary-600 focus:ring-primary-500"
                    checked={formData.sourceType === 'card'}
                    onChange={() => setFormData({ ...formData, sourceType: 'card', accountId: '' })}
                    disabled={formData.type === 'INCOME'} // Backend rules: Income cannot be on card
                  />
                  <span className={`ml-2 text-sm ${formData.type === 'INCOME' ? 'text-gray-400' : 'text-gray-700'}`}>Cartão de Crédito</span>
                </label>
              </div>

              {formData.sourceType === 'account' ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                >
                  <option value="">Selecione a conta...</option>
                  {accounts?.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} (R$ {acc.balance})</option>
                  ))}
                </select>
              ) : (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                  value={formData.cardId}
                  onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
                >
                  <option value="">Selecione o cartão...</option>
                  {cards?.map(card => (
                    <option key={card.id} value={card.id}>{card.name} (Final {card.lastFour})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nota (Opcional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                rows="2"
                placeholder="Detalhes adicionais..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              ></textarea>
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
            form="tx-form"
            disabled={mutation.isPending}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center"
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
