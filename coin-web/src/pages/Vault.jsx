import React, { useState } from 'react';
import { Plus, PiggyBank, Edit2, Trash2, Home, Car, Plane, Laptop, GraduationCap, Heart, CheckCircle2 } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { formatCurrency, formatDate } from '../utils/helpers';
import GoalModal from '../components/ui/GoalModal';
import DepositModal from '../components/ui/DepositModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

// Helper to render icon by name
const IconByName = ({ name, className }) => {
  const icons = {
    PiggyBank: <PiggyBank className={className} />,
    Home: <Home className={className} />,
    Car: <Car className={className} />,
    Plane: <Plane className={className} />,
    Laptop: <Laptop className={className} />,
    GraduationCap: <GraduationCap className={className} />,
    Heart: <Heart className={className} />,
  };
  return icons[name] || <PiggyBank className={className} />;
};

const Vault = () => {
  const queryClient = useQueryClient();
  const { data: goals, isLoading, isError } = useGoals();
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [goalToDeposit, setGoalToDeposit] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/savings-goals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      queryClient.invalidateQueries(['dashboardSummary']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteMutation.mutate(id);
    }
  };

  const openNewGoalModal = () => {
    setGoalToEdit(null);
    setIsGoalModalOpen(true);
  };

  const openEditGoalModal = (goal) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  };

  const openDepositModal = (goal) => {
    setGoalToDeposit(goal);
    setIsDepositModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500">Erro ao carregar metas do cofre.</div>;
  }

  const totalSaved = goals?.reduce((acc, goal) => acc + (goal.currentAmount || 0), 0) || 0;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cofre de Metas</h1>
          <p className="text-gray-500 mt-1">Guarde dinheiro para seus sonhos e objetivos</p>
        </div>
        <button
          onClick={openNewGoalModal}
          className="hidden md:flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium mt-4 md:mt-0"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Nova Meta
        </button>
      </div>

      {/* Highlight Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-md p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <p className="text-white text-opacity-80 font-medium mb-1">Total Guardado no Cofre</p>
            <h2 className="text-4xl md:text-5xl font-bold">{formatCurrency(totalSaved)}</h2>
          </div>
          <div className="mt-6 md:mt-0 bg-white bg-opacity-20 rounded-xl p-4 flex items-center backdrop-blur-sm">
            <PiggyBank className="w-8 h-8 mr-3 text-white" />
            <div>
              <p className="text-sm font-medium text-white text-opacity-80">Metas Ativas</p>
              <p className="text-xl font-bold">{goals?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      {goals && goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const current = goal.currentAmount || 0;
            const target = goal.targetAmount || 1;
            const progress = Math.min((current / target) * 100, 100);
            const isCompleted = goal.isCompleted || current >= target;
            const remaining = Math.max(target - current, 0);

            return (
              <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1">
                  {/* Goal Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: goal.color || '#8B5CF6' }}
                      >
                        <IconByName name={goal.icon} className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900 text-lg">{goal.name}</h3>
                        <p className="text-sm text-gray-500">Prazo: {formatDate(goal.deadline)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => openEditGoalModal(goal)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Financial Values */}
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Acumulado</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(current)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Meta</p>
                      <p className="text-sm font-semibold text-gray-700">{formatCurrency(target)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden relative">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: goal.color || '#8B5CF6'
                      }}
                    ></div>
                    {isCompleted && (
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Progress details */}
                  <div className="flex justify-between text-sm font-medium">
                    <span style={{ color: goal.color || '#8B5CF6' }}>{progress.toFixed(1)}%</span>
                    {!isCompleted && <span className="text-gray-500">Faltam {formatCurrency(remaining)}</span>}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                  {isCompleted ? (
                    <div className="flex items-center text-green-600 font-bold animate-bounce mt-1">
                      <CheckCircle2 className="w-5 h-5 mr-1.5" />
                      Meta Concluída!
                    </div>
                  ) : (
                    <button
                      onClick={() => openDepositModal(goal)}
                      className="w-full py-2 bg-white border border-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center justify-center"
                    >
                      <PiggyBank className="w-4 h-4 mr-2" />
                      Depositar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <PiggyBank className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhuma meta definida</h3>
          <p className="text-gray-500 mt-1 mb-6 max-w-sm mx-auto">Comece a planejar seu futuro criando metas para viagens, compras ou reservas de emergência.</p>
          <button
            onClick={openNewGoalModal}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            Criar Minha Primeira Meta
          </button>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={openNewGoalModal}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} goalToEdit={goalToEdit} />
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} goal={goalToDeposit} />
    </div>
  );
};

export default Vault;
