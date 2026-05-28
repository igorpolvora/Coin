import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, CheckCircle, Clock, Check } from 'lucide-react';
import { useBills } from '../hooks/useBills';
import { formatCurrency } from '../utils/helpers';
import BillModal from '../components/ui/BillModal';
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

const Bills = () => {
  const queryClient = useQueryClient();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: bills, isLoading, isError } = useBills(selectedMonth, selectedYear);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/fixed-bills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['bills']);
    }
  });

  const togglePaymentMutation = useMutation({
    mutationFn: ({ id, isPaid }) => {
      const endpoint = isPaid ? 'unpay' : 'pay';
      return api.put(`/fixed-bills/${id}/${endpoint}`, null, {
        params: { month: selectedMonth, year: selectedYear }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bills']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta fixa? Isso não removerá pagamentos passados.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggle = (bill) => {
    togglePaymentMutation.mutate({ id: bill.id, isPaid: bill.isPaid });
  };

  const openNewModal = () => {
    setBillToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (bill) => {
    setBillToEdit(bill);
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
    return <div className="text-center py-20 text-red-500">Erro ao carregar contas fixas.</div>;
  }

  const paidBills = bills?.filter(b => b.isPaid) || [];
  const pendingBills = bills?.filter(b => !b.isPaid) || [];

  const totalPaid = paidBills.reduce((acc, b) => acc + b.amount, 0);
  const totalPending = pendingBills.reduce((acc, b) => acc + b.amount, 0);
  const totalMonth = totalPaid + totalPending;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contas Fixas</h1>
          <p className="text-gray-500 mt-1">Gerencie seus compromissos recorrentes</p>
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
            Nova Conta
          </button>
        </div>
      </div>

      {/* Summary Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-4">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total do Mês</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonth)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pago</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pendente</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</p>
          </div>
        </div>
      </div>

      {bills?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhuma conta fixa cadastrada</h3>
          <p className="text-gray-500 mt-1 mb-6 max-w-sm mx-auto">
            Cadastre aluguel, internet, e outras contas que se repetem todo mês.
          </p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            Cadastrar Primeira Conta
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pendentes */}
          {pendingBills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-500" />
                Pendentes ({pendingBills.length})
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {pendingBills.map(bill => (
                  <BillRow 
                    key={bill.id} 
                    bill={bill} 
                    onEdit={openEditModal} 
                    onDelete={handleDelete} 
                    onToggle={handleToggle} 
                    isToggling={togglePaymentMutation.isPending}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Pagas */}
          {paidBills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Pagas ({paidBills.length})
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {paidBills.map(bill => (
                  <BillRow 
                    key={bill.id} 
                    bill={bill} 
                    onEdit={openEditModal} 
                    onDelete={handleDelete} 
                    onToggle={handleToggle}
                    isToggling={togglePaymentMutation.isPending} 
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={openNewModal}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <BillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} billToEdit={billToEdit} />
    </div>
  );
};

const BillRow = ({ bill, onEdit, onDelete, onToggle, isToggling }) => {
  return (
    <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors group">
      
      {/* Main Info */}
      <div className="flex items-center flex-1">
        <button 
          onClick={() => onToggle(bill)}
          disabled={isToggling}
          className={`mr-4 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            bill.isPaid 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-500 bg-transparent'
          }`}
        >
          {bill.isPaid && <Check className="w-5 h-5" />}
        </button>
        
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: bill.category?.color || '#CBD5E1' }}
        >
          <span className="font-bold text-sm">{bill.category?.name?.charAt(0).toUpperCase()}</span>
        </div>
        
        <div className="ml-4">
          <h3 className="font-bold text-gray-900">{bill.description}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-0.5 space-x-2">
            <span>{bill.category?.name}</span>
            <span>•</span>
            <span className="flex items-center">
              Vence dia {String(bill.dueDay).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Value and Actions */}
      <div className="mt-4 md:mt-0 pl-16 md:pl-0 flex items-center justify-between md:justify-end w-full md:w-auto">
        <div className="text-right mr-4 md:mr-8">
          <span className={`font-bold text-lg ${bill.isPaid ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {formatCurrency(bill.amount)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full mr-2 md:hidden ${
            bill.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {bill.isPaid ? 'Pago' : 'Pendente'}
          </span>
          <button onClick={() => onEdit(bill)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(bill.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bills;
