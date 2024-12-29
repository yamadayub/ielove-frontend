import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { ListingItem } from '../types/listing_types';

/**
 * 出品一覧を取得するカスタムフック
 */
export const useListings = () => {
  const axios = useAuthenticatedAxios();

  return useQuery<ListingItem[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.LISTING.GET_ALL);
      return data;
    },
    retry: false
  });
};

/**
 * 個別の出品情報を取得するカスタムフック
 */
export const useListing = (id: number | undefined) => {
  const axios = useAuthenticatedAxios();

  return useQuery<ListingItem>({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.LISTING.GET_ONE(id!));
      return data;
    },
    enabled: !!id,
  });
}; 