import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import type { Drawing } from '../types/drawing_types';

export const useDrawing = (drawingId?: string) => {
  const axios = useAuthenticatedAxios();

  return useQuery<Drawing>({
    queryKey: ['drawing', drawingId],
    queryFn: async () => {
      if (!drawingId) throw new Error('図面IDが指定されていません');
      const { data } = await axios.get(ENDPOINTS.GET_DRAWING(Number(drawingId)));
      return data;
    },
    enabled: !!drawingId,
  });
}; 