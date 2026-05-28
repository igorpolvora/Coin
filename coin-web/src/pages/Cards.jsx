import React, { useState } from 'react';
import { Plus, CreditCard, Calendar, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { formatCurrency } from '../utils/helpers';
import CardModal from '../components/ui/CardModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const Cards = () => {
  const queryClient = useQueryClient();
  const { data: cards, isLoading, isError } = useCards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/cards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['cards']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão? Isso não excluirá as transações vinculadas a ele, mas o cartão não aparecerá mais.')) {
      deleteMutation.mutate(id);
    }
  };

  const openNewModal = () => {
    setCardToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setCardToEdit(card);
    setIsModalOpen(true);
  };

  const currentMonth = new Date().getMonth() + 1;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500">Erro ao carregar cartões.</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Cartões</h1>
          <p className="text-gray-500 mt-1">Gerencie seus limites e faturas</p>
        </div>
        <button
          onClick={openNewModal}
          className="hidden md:flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Novo Cartão
        </button>
      </div>

      {/* Cards Grid */}
      {cards && cards.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cards.map((card) => {
            const bill = card.currentBill || 0;
            const limit = card.creditLimit || 0;
            const available = limit - bill;
            const progressPercent = limit > 0 ? Math.min((bill / limit) * 100, 100) : 0;
            const isNearLimit = progressPercent > 80;

            return (
              <div key={card.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {/* Visual Card Header */}
                <div 
                  className="p-6 text-white relative overflow-hidden flex flex-col justify-between"
                  style={{ backgroundColor: card.color, minHeight: '160px' }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-8 -mb-8 blur-lg"></div>
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 opacity-80" />
                      <span className="font-semibold text-lg">{card.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => openEditModal(card)} className="p-1.5 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(card.id)} className="p-1.5 bg-red-500 bg-opacity-80 hover:bg-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex justify-between items-end">
                    <div className="text-2xl font-mono tracking-widest text-white text-opacity-90">
                      •••• {card.lastFour}
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs uppercase tracking-wider text-white text-opacity-70 font-semibold mb-0.5 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> Vencimento
                      </span>
                      <span className="font-medium text-lg">Dia {card.dueDay}</span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fatura Atual</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(bill)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-500">Limite</p>
                        <p className="text-sm font-semibold text-gray-700">{formatCurrency(limit)}</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${isNearLimit ? 'bg-red-500' : 'bg-primary-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs mt-2">
                      <span className={`${isNearLimit ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {progressPercent.toFixed(1)}% utilizado
                      </span>
                      <span className="text-green-600 font-medium text-sm">
                        {formatCurrency(available)} Disponível
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link 
                      to={`/transactions?cardId=${card.id}&month=${currentMonth}`}
                      className="flex items-center justify-center w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-primary-600 font-medium rounded-lg transition-colors"
                    >
                      Ver Transações do Mês
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum cartão cadastrado</h3>
          <p className="text-gray-500 mt-1 mb-6">Adicione seu primeiro cartão de crédito para acompanhar faturas e limites.</p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            Adicionar Cartão
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

      <CardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cardToEdit={cardToEdit} />
    </div>
  );
};

export default Cards;
