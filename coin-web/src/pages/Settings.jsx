import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { User, Wallet, Tags, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import CategoryModal from '../components/ui/CategoryModal';
import AccountModal from '../components/ui/AccountModal';
import EmptyState from '../components/ui/EmptyState';
import PageSkeleton from '../components/ui/PageSkeleton';

const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('accounts');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);

  const { data: categories, isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    }
  });

  const { data: accounts, isLoading: isLoadingAccs } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await api.get('/accounts');
      return data;
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['categories'])
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id) => api.delete(`/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['dashboardSummary']);
    }
  });

  if (isLoadingCats || isLoadingAccs) return <PageSkeleton />;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie suas contas, categorias e preferências</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5 mr-3" /> Meu Perfil
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'accounts' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Wallet className="w-5 h-5 mr-3" /> Contas e Bancos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'categories' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Tags className="w-5 h-5 mr-3" /> Categorias
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
              
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>

              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Contas Bancárias</h2>
                <button
                  onClick={() => { setAccountToEdit(null); setIsAccountModalOpen(true); }}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Adicionar
                </button>
              </div>

              {accounts?.length === 0 ? (
                <EmptyState 
                  icon={Wallet} 
                  title="Nenhuma conta cadastrada" 
                  message="Comece adicionando suas contas correntes e carteiras."
                />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  {accounts?.map(acc => (
                    <div key={acc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white mr-4 shadow-sm"
                          style={{ backgroundColor: acc.color || '#3B82F6' }}
                        >
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{acc.name}</p>
                          <p className="text-xs text-gray-500">{acc.type === 'CHECKING' ? 'Conta Corrente' : acc.type === 'SAVINGS' ? 'Poupança' : 'Carteira'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button onClick={() => { setAccountToEdit(acc); setIsAccountModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if(window.confirm('Excluir conta?')) deleteAccountMutation.mutate(acc.id); }} className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Categorias Customizadas</h2>
                <button
                  onClick={() => { setCategoryToEdit(null); setIsCategoryModalOpen(true); }}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Adicionar
                </button>
              </div>

              {categories?.length === 0 ? (
                <EmptyState 
                  icon={Tags} 
                  title="Nenhuma categoria customizada" 
                  message="Você pode criar categorias personalizadas para organizar melhor seus gastos."
                />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  {categories?.map(cat => (
                    <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 shadow-sm"
                          style={{ backgroundColor: cat.color || '#8B5CF6' }}
                        >
                          <span className="font-bold text-sm">{cat.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{cat.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${cat.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {cat.type === 'INCOME' ? 'Receita' : 'Gasto'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button onClick={() => { setCategoryToEdit(cat); setIsCategoryModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if(window.confirm('Excluir categoria?')) deleteCategoryMutation.mutate(cat.id); }} className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} categoryToEdit={categoryToEdit} />
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} accountToEdit={accountToEdit} />
    </div>
  );
};

export default Settings;
