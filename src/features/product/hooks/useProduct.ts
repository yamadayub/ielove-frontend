import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import type { Product } from '../types/product_types';

/**
 * 指定されたIDの製品を取得するカスタムフック
 * @param productId - 製品ID
 */
export const useProduct = (productId: string | undefined) => {
  const axios = useAuthenticatedAxios();

  return useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');

      const { data } = await axios.get(ENDPOINTS.GET_PRODUCT(productId));
      return data;
    },
    enabled: !!productId,
    retry: false,
  });
};
