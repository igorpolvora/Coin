import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useBills = (month, year) => {
  return useQuery({
    queryKey: ['bills', month, year],
    queryFn: async () => {
      const { data } = await api.get('/fixed-bills', { params: { month, year } });
      return data;
    },
    staleTime: 60 * 1000,
  });
};
