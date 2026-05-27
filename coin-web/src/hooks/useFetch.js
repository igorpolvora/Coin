import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

export const useFetch = (url, options = {}) => {
  return useQuery({
    queryKey: [url],
    queryFn: () => api.get(url).then(res => res.data),
    ...options
  })
}
