import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import type { Drawing } from '../types/drawing_types';

interface UseDrawingsParams {
  propertyId?: string;
}

export const useDrawings = ({ propertyId }: UseDrawingsParams) => {
  const axios = useAuthenticatedAxios();

  return useQuery<Drawing[]>({
    queryKey: ['drawings', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      const { data } = await axios.get(ENDPOINTS.GET_DRAWINGS_BY_PROPERTY(Number(propertyId)));
      return data;
    },
    enabled: !!propertyId,
  });
}; 