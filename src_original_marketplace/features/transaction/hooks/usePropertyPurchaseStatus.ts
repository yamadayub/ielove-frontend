import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { useAuth } from '@clerk/clerk-react';
import { ENDPOINTS } from '../../shared/api/endpoints';

interface TransactionCheckResponse {
  isPurchased: boolean;
  purchaseInfo?: {
    transactionId: number;
    purchaseDate: string;
    amount: number;
  };
}

export const usePropertyPurchaseStatus = (propertyId: number | undefined) => {
  const { isSignedIn } = useAuth();
  const axios = useAuthenticatedAxios();

  return useQuery({
    queryKey: ['property-purchase-status', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required');
      const { data } = await axios.get<TransactionCheckResponse>(
        `${ENDPOINTS.TRANSACTIONS.CHECK}?property_id=${propertyId}`
      );
      return data;
    },
    enabled: !!propertyId && isSignedIn,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュを維持
    gcTime: 1000 * 60 * 30, // 30分間キャッシュを保持
  });
}; 