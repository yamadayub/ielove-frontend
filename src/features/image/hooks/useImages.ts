import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { Image } from '../types/image_types'

interface UseImagesParams {
  propertyId?: string
  roomId?: string
  productId?: string
  skip?: number
  limit?: number
}

/**
 * 指定されたエンティティ（物件、部屋、製品）に関連する画像一覧を取得するカスタムフック
 * @param params.entity_type - エンティティの種類（'property' | 'room' | 'product'）
 * @param params.entity_id - エンティティのID
 */
export const useImages = ({ propertyId, roomId, productId, skip = 0, limit = 100 }: UseImagesParams) => {
  const axios = useAuthenticatedAxios()

  return useQuery<Image[]>({
    queryKey: ['images', { propertyId, roomId, productId, skip, limit }],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.GET_IMAGES, {
        params: {
          property_id: propertyId,
          room_id: roomId,
          product_id: productId,
          skip,
          limit
        }
      })
      return data
    },
    retry: false,
  })
}