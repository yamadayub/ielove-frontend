import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { User } from '../types/user_types';

interface UserUpdate {
  username?: string;
  email?: string;
  role?: 'buyer' | 'seller' | 'both';
}

interface SellerProfileUpdate {
  company_name?: string;
  representative_name?: string;
  postal_code?: string;
  address?: string;
  phone_number?: string;
  business_registration_number?: string;
  tax_registration_number?: string;
}

/**
 * 現在のユーザー情報を取得するカスタムフック
 */
export const useUser = (clerkUserId: string | null | undefined) => {
  const axios = useAuthenticatedAxios();

  return useQuery({
    queryKey: ['user', clerkUserId],
    queryFn: async () => {
      if (!clerkUserId) throw new Error('Clerk User ID is required');
      const { data } = await axios.get<User>(ENDPOINTS.USER.ME);
      return data;
    },
    enabled: !!clerkUserId,
  });
};

/**
 * ユーザー情報を更新するカスタムフック
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const axios = useAuthenticatedAxios();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: UserUpdate }) => {
      const { data } = await axios.patch<User>(ENDPOINTS.USER.UPDATE_ME, userData);
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

/**
 * 販売者プロフィールを更新するカスタムフック
 */
export const useUpdateSellerProfile = () => {
  const queryClient = useQueryClient();
  const axios = useAuthenticatedAxios();

  return useMutation({
    mutationFn: async ({ userId, profileData }: { userId: number; profileData: SellerProfileUpdate }) => {
      const { data } = await axios.patch(ENDPOINTS.USER.UPDATE_SELLER, profileData);
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile', userId] });
    },
  });
};

/**
 * 販売者プロフィールを作成するカスタムフック
 */
export const useCreateSellerProfile = () => {
  const queryClient = useQueryClient();
  const axios = useAuthenticatedAxios();

  return useMutation({
    mutationFn: async ({ userId, profileData }: { userId: number; profileData: SellerProfileUpdate }) => {
      const { data } = await axios.post(ENDPOINTS.USER.CREATE_SELLER, profileData);
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile', userId] });
    },
  });
}; 