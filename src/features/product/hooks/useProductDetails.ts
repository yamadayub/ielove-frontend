import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { ProductDetails } from '../types/product_types'

/**
 * 指定されたIDの製品の詳細情報を取得するカスタムフック
 * 製品情報、仕様、寸法、画像などの関連情報を含む
 * @param productId - 製品ID
 */
export const useProductDetails = (productId: string | undefined) => {
  const axios = useAuthenticatedAxios()

  return useQuery<ProductDetails>({
    queryKey: ['product-details', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required')
      const { data } = await axios.get(ENDPOINTS.GET_PRODUCT_DETAILS(productId))
      return data
    },
    enabled: !!productId,
    retry: false
  })
}