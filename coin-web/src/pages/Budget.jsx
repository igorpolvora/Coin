import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Target, AlertTriangle, TrendingDown } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/helpers';
import BudgetModal from '../components/ui/BudgetModal';
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

const Budget = () => {
  const queryClient = useQueryClient();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: budgets, isLoading, isError } = useBudget(selectedMonth, selectedYear);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/budgets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteMutation.mutate(id);
    }
  };

  const openNewModal = () => {
    setBudgetToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setBudgetToEdit(budget);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500">Erro ao carregar orçamentos.</div>;
  }

  const totalBudgeted = budgets?.reduce((acc, b) => acc + b.amountLimit, 0) || 0;
  const totalSpent = budgets?.reduce((acc, b) => acc + (b.spent || 0), 0) || 0;
  const totalRemaining = Math.max(totalBudgeted - totalSpent, 0);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamento</h1>
          <p className="text-gray-500 mt-1">Controle seus gastos por categoria</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <select
              className="px-3 py-2 text-sm text-gray-700 bg-transparent focus:outline-none border-r border-gray-200"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select
              className="px-3 py-2 text-sm text-gray-700 bg-transparent focus:outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button
            onClick={openNewModal}
            className="hidden md:flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            Definir Limite
          </button>
        </div>
      </div>

      {/* Summary Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orçado</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudgeted)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Gasto</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Restante no Mês</p>
            <p className={`text-2xl font-bold ${totalSpent > totalBudgeted && totalBudgeted > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Budget List */}
      {budgets && budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const spent = budget.spent || 0;
            const limit = budget.amountLimit;
            const percentage = Math.min((spent / limit) * 100, 100);
            const isOverBudget = spent > limit;
            const isWarning = !isOverBudget && (spent / limit) >= 0.8;
            const remaining = Math.max(limit - spent, 0);

            // Determine bar color
            let barColor = 'bg-primary-500'; // Default Blue/Green
            if (isOverBudget) barColor = 'bg-red-500';
            else if (isWarning) barColor = 'bg-orange-500';

            return (
              <div key={budget.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: budget.category.color || '#CBD5E1' }}
                    >
                      <span className="font-bold text-sm">{budget.category.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 truncate">{budget.category.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => openEditModal(budget)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(budget.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Values */}
                <div className="mb-3">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(spent)}</span>
                    <span className="text-sm font-medium text-gray-500">de {formatCurrency(limit)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Status Text */}
                <div className="mt-auto pt-2">
                  {isOverBudget ? (
                    <div className="flex items-center text-sm font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      <AlertTriangle className="w-4 h-4 mr-1.5" />
                      {formatCurrency(spent - limit)} acima do limite
                    </div>
                  ) : (
                    <div className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg ${isWarning ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'}`}>
                      {isWarning && <AlertTriangle className="w-4 h-4 mr-1.5 text-orange-500" />}
                      Restam {formatCurrency(remaining)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum orçamento definido</h3>
          <p className="text-gray-500 mt-1 mb-6 max-w-sm mx-auto">
            Defina limites de gastos por categoria para o mês de {String(selectedMonth).padStart(2, '0')}/{selectedYear}.
          </p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            Definir Primeiro Limite
          </button>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={openNewModal}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <BudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        budgetToEdit={budgetToEdit}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
      />
    </div>
  );
};

export default Budget;
