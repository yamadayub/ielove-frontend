import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL.replace(/\/+$/, '');

export const useUserProfile = (userId) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/users/me?clerk_user_id=${userId}`);
      return data;
    },
    enabled: !!userId,
    retry: false
  });
};

export const useSellerProfile = (userId) => {
  return useQuery({
    queryKey: ['sellerProfile', userId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/users/me/seller?user_id=${userId}`);
      return data;
    },
    enabled: !!userId,
    retry: false
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await axios.patch(`${API_URL}/api/users/me`, userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  });
};

export const useUpdateSellerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sellerData) => {
      const response = await axios.patch(`${API_URL}/api/users/me/seller`, sellerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProfile'] });
    }
  });
};

export const useCreateSellerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sellerData) => {
      const response = await axios.post(`${API_URL}/api/users/me/seller`, sellerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProfile'] });
    }
  });
}; 