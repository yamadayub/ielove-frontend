import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User, UserUpdate, SellerProfile, SellerProfileUpdate } from '../../types/user';

/**
 * 現在のユーザー情報を取得するカスタムフック
 */
export const useUser = (clerkUserId) => {
  return useQuery({
    queryKey: ['user', clerkUserId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/me`, {
        params: { clerk_user_id: clerkUserId }
      });
      return data;
    },
    retry: false,
  });
};

/**
 * 販売者プロフィールを取得するカスタムフック
 */
export const useSellerProfile = (userId) => {
  return useQuery({
    queryKey: ['seller-profile', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/me/seller`, {
        params: { user_id: userId }
      });
      return data;
    },
    retry: false,
  });
};

/**
 * ユーザー情報を更新するカスタムフック
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }) => {
      const { data } = await axios.patch(`/api/users/me`, userData, {
        params: { user_id: userId }
      });
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

  return useMutation({
    mutationFn: async ({ userId, profileData }) => {
      const { data } = await axios.patch(`/api/users/me/seller`, profileData, {
        params: { user_id: userId }
      });
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

  return useMutation({
    mutationFn: async ({ userId, profileData }) => {
      const { data } = await axios.post(`/api/users/me/seller`, profileData, {
        params: { user_id: userId }
      });
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile', userId] });
    },
  });
}; 