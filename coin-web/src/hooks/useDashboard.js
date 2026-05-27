import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/summary');
      return data;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 30000,
  });
};
