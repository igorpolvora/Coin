import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useBudget = (month, year) => {
  return useQuery({
    queryKey: ['budgets', month, year],
    queryFn: async () => {
      const { data } = await api.get('/budgets', { params: { month, year } });
      return data;
    },
    staleTime: 60 * 1000,
  });
};
