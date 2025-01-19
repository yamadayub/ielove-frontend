import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { Image } from '../types/image_types'

interface UseImagesParams {
  propertyId?: number
  roomId?: number
  productId?: number
  productSpecificationId?: number
  drawingId?: number
  skip?: number
  limit?: number
}

/**
 * 指定されたエンティティ（物件、部屋、製品）に関連する画像一覧を取得するカスタムフック
 * @param params.entity_type - エンティティの種類（'property' | 'room' | 'product'）
 * @param params.entity_id - エンティティのID
 */
export const useImages = ({
  propertyId,
  roomId,
  productId,
  productSpecificationId,
  drawingId,
  skip = 0,
  limit = 100
}: UseImagesParams = {}) => {
  const axios = useAuthenticatedAxios()

  // クエリパラメータの構築
  const params = {
    ...(propertyId && { property_id: propertyId.toString() }),
    ...(roomId && { room_id: roomId.toString() }),
    ...(productId && { product_id: productId.toString() }),
    ...(productSpecificationId && { product_specification_id: productSpecificationId.toString() }),
    ...(drawingId && { drawing_id: drawingId.toString() }),
    // property_idとdrawing_idが両方指定された場合はinclude_childrenを追加
    ...(propertyId && drawingId && { include_children: 'true' })
  };

  console.log('useImages params:', params);

  return useQuery({
    queryKey: ['images', { propertyId, roomId, productId, productSpecificationId, drawingId }],
    queryFn: async () => {
      const { data } = await axios.get<Image[]>(
        `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.GET_IMAGES}`,
        { params }
      );

      console.log('useImages response:', data);
      return data;
    },
    enabled: !!(propertyId || roomId || productId || productSpecificationId || drawingId)
  })
}