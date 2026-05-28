import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await api.get('/accounts');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
