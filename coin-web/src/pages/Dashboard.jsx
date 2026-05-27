import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency, formatDate } from '../utils/helpers';
import StatCard from '../components/ui/StatCard';
import FlowChart from '../components/charts/FlowChart';
import CategoryChart from '../components/charts/CategoryChart';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight, Clock } from 'lucide-react';

const Dashboard = () => {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Erro ao carregar o dashboard. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe suas finanças em tempo real.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Saldo Disponível" 
          value={formatCurrency(data.totalBalance)} 
          icon={Wallet} 
          colorClass="bg-blue-500 text-blue-600" 
        />
        <StatCard 
          title="Renda do Mês" 
          value={formatCurrency(data.monthIncome)} 
          icon={TrendingUp} 
          colorClass="bg-green-500 text-green-600" 
        />
        <StatCard 
          title="Gastos do Mês" 
          value={formatCurrency(data.monthExpense)} 
          icon={TrendingDown} 
          colorClass="bg-red-500 text-red-600" 
        />
        <StatCard 
          title="No Cofre" 
          value={formatCurrency(data.vaultTotal)} 
          icon={PiggyBank} 
          colorClass="bg-purple-500 text-purple-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlowChart data={data.monthlyFlow} />
        <CategoryChart data={data.categoryBreakdown} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Últimas Transações</h3>
          <Link to="/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            Ver todas
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {data.recentTransactions && data.recentTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {data.recentTransactions.map((tx) => (
              <li key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: tx.category?.color || '#CBD5E1' }}
                  >
                    {/* Placeholder icon since we only have the icon string in DB */}
                    <span className="font-bold text-sm">{tx.category?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{tx.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(tx.date)}
                      <span className="mx-2">•</span>
                      {tx.category?.name}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : tx.type === 'EXPENSE' ? 'text-red-600' : 'text-gray-900'}`}>
                  {tx.type === 'EXPENSE' ? '-' : tx.type === 'INCOME' ? '+' : ''}
                  {formatCurrency(tx.amount)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Nenhuma transação recente encontrada.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
