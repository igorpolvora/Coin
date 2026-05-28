import React, { useState, useEffect } from 'react';
import { X, Home, Car, Plane, Laptop, GraduationCap, Heart, PiggyBank } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const presetColors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#06B6D4', '#14B8A6'];
const presetIcons = ['PiggyBank', 'Home', 'Car', 'Plane', 'Laptop', 'GraduationCap', 'Heart'];

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

const GoalModal = ({ isOpen, onClose, goalToEdit = null }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    icon: 'PiggyBank',
    color: '#8B5CF6'
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setFormData({
        name: goalToEdit.name,
        targetAmount: goalToEdit.targetAmount,
        deadline: goalToEdit.deadline,
        icon: goalToEdit.icon || 'PiggyBank',
        color: goalToEdit.color || '#8B5CF6'
      });
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        deadline: '',
        icon: 'PiggyBank',
        color: '#8B5CF6'
      });
    }
    setError('');
  }, [goalToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (goalToEdit) {
        return api.put(`/savings-goals/${goalToEdit.id}`, data);
      }
      return api.post('/savings-goals', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      queryClient.invalidateQueries(['dashboardSummary']);
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Erro ao salvar meta');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      deadline: formData.deadline,
      icon: formData.icon,
      color: formData.color,
      isCompleted: false
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {goalToEdit ? 'Editar Meta' : 'Nova Meta'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form id="goal-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Meta *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Viagem para Europa"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Alvo *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
              <div className="flex flex-wrap gap-2">
                {presetIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-2 rounded-lg transition-colors ${formData.icon === icon ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    <IconByName name={icon} className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
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
            form="goal-form"
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

export default GoalModal;
