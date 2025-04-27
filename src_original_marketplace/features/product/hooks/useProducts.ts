import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { Product } from '../types/product_types'

interface UseProductsParams {
  roomId: number | undefined
  skip?: number
  limit?: number
}

/**
 * 指定された部屋IDに属する製品一覧を取得するカスタムフック
 * @param params.roomId - 部屋ID
 * @param params.skip - スキップする件数（オプション、デフォルト: 0）
 * @param params.limit - 取得する最大件数（オプション、デフォルト: 100）
 */
export const useProducts = ({ roomId, skip = 0, limit = 100 }: UseProductsParams) => {
  const axios = useAuthenticatedAxios()

  return useQuery<Product[]>({
    queryKey: ['products', roomId, skip, limit],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID is required')

      const { data } = await axios.get(ENDPOINTS.GET_PRODUCTS, {
        params: {
          room_id: roomId,
          skip,
          limit
        }
      })
      console.log('Products API response:', data)
      return data
    },
    enabled: !!roomId,
    retry: false
  })
}