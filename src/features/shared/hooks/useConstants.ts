import { useQuery } from '@tanstack/react-query';
import axios from '../api/axios';
import { Constants } from '../types/constants';
import { ENDPOINTS } from '../api/endpoints';

export const useConstants = () => {
  return useQuery<Constants>({
    queryKey: ['constants'],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.CONSTANTS.GET_ALL);
      return data;
    },
  });
}; 