import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useTransactions = (filters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const { data } = await api.get('/transactions', { params: filters });
      return data;
    },
    staleTime: 30000,
  });
};
