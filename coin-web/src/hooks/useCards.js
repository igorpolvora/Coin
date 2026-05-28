import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useCards = () => {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data } = await api.get('/cards');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
