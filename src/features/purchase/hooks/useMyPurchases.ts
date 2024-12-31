import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import type { PurchaseHistoryResponse } from '../types/transaction_types';

export const useMyPurchases = () => {
  const axios = useAuthenticatedAxios();
  return useQuery({
    queryKey: ['my-purchases'],
    queryFn: async () => {
      const { data } = await axios.get<PurchaseHistoryResponse>(ENDPOINTS.TRANSACTIONS.PURCHASED);
      return data;
    }
  });
}; 