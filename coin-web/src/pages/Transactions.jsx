import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Filter, Trash2, Edit2, Calendar } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency, formatDate } from '../utils/helpers';
import TransactionModal from '../components/ui/TransactionModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
const months = [
  { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
];

const Transactions = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // Filters State initialized from URL if present
  const urlCardId = searchParams.get('cardId');
  const urlMonth = searchParams.get('month');

  const [filters, setFilters] = useState({
    month: urlMonth ? parseInt(urlMonth) : new Date().getMonth() + 1,
    year: currentYear,
    type: '', // '' = All, 'INCOME', 'EXPENSE'
    categoryId: '',
    cardId: urlCardId || '',
    page: 0,
    size: 20
  });

  const { data: categories } = useCategories();
  const { data: pageData, isLoading, isError } = useTransactions(filters);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['dashboardSummary']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEditModal = (tx) => {
    setTransactionToEdit(tx);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 })); // Reset page on filter change
  };

  // Group transactions by Date
  const groupedTransactions = useMemo(() => {
    if (!pageData?.content) return {};
    return pageData.content.reduce((acc, tx) => {
      const dateKey = tx.date;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(tx);
      return acc;
    }, {});
  }, [pageData]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">
      {/* Header & Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
            <p className="text-gray-500 mt-1">Gerencie suas receitas e despesas</p>
          </div>
          <button
            onClick={openNewModal}
            className="hidden md:flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            Nova Transação
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2 text-gray-500">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <select 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
          >
            <option value="">Mês (Todos)</option>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>

          <select 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="">Ano (Todos)</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Tipo (Todos)</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Gastos</option>
          </select>

          <select 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
            value={filters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
          >
            <option value="">Categoria (Todas)</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Hidden badge if filtered by card */}
          {filters.cardId && (
            <div className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
              <span className="font-medium mr-2">Filtrado por Cartão</span>
              <button onClick={() => handleFilterChange('cardId', '')} className="hover:text-blue-900">&times;</button>
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="flex py-20 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">Erro ao carregar transações.</div>
      ) : Object.keys(groupedTransactions).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Nenhuma transação encontrada com os filtros atuais.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, txs]) => (
            <div key={date}>
              <div className="flex items-center text-sm font-semibold text-gray-500 mb-3 pl-2">
                <Calendar className="w-4 h-4 mr-1.5" />
                {formatDate(date)}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {txs.map(tx => (
                    <li key={tx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 group transition-colors duration-150">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: tx.category?.color || '#CBD5E1' }}
                        >
                          <span className="font-bold text-sm">{tx.category?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-gray-900 truncate">{tx.description}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{tx.category?.name} • {tx.card ? `Cartão final ${tx.card.lastFour}` : tx.account ? tx.account.name : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                        <div className={`font-semibold text-right ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'EXPENSE' ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </div>
                        {/* Actions (Hover on Desktop, swipe usually on mobile, but keeping it simple with icon) */}
                        <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(tx)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(tx.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {pageData?.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <button 
                disabled={pageData.first}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">Página {pageData.number + 1} de {pageData.totalPages}</span>
              <button 
                disabled={pageData.last}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <button
        onClick={openNewModal}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactionToEdit={transactionToEdit} 
      />
    </div>
  );
};

export default Transactions;
