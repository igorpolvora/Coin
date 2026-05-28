import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data } = await api.get('/savings-goals');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
