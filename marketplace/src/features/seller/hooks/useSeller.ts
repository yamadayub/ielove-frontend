import { useQuery } from '@tanstack/react-query';
import { SellerProfileSchema, StripeOnboardingStatus } from '../types/seller_types';
import { useSellerAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';

/**
 * 販売者プロフィールを取得するカスタムフック
 */
export const useSellerProfile = (userId: number | undefined) => {
  const axios = useSellerAxios();

  return useQuery({
    queryKey: ['seller-profile', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const { data } = await axios.get<SellerProfileSchema>(ENDPOINTS.USER.GET_SELLER);
      return data;
    },
    enabled: !!userId,
    retry: false,
  });
};

/**
 * Stripeアカウントのステータスを取得するカスタムフック
 */
export const useStripeStatus = (userId: number | undefined, stripeAccountId: string | undefined | null) => {
  const axios = useSellerAxios();

  return useQuery({
    queryKey: ['stripe-status', userId, stripeAccountId],
    queryFn: async () => {
      if (!userId || !stripeAccountId) {
        throw new Error('User ID and Stripe Account ID are required');
      }
      const { data } = await axios.get<StripeOnboardingStatus>(ENDPOINTS.SELLER.GET_ONBOARDING_STATUS);
      return data;
    },
    enabled: !!userId && !!stripeAccountId,
    retry: 1,
  });
}; 