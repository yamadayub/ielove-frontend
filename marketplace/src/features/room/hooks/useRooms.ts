import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { Room } from '../types/room_types'

interface UseRoomsParams {
  propertyId: string | undefined;
  skip?: number;
  limit?: number;
}

/**
 * 指定された物件IDに属する部屋一覧を取得するカスタムフック
 * @param params.propertyId - 物件ID
 * @param params.skip - スキップする件数（オプション、デフォルト: 0）
 * @param params.limit - 取得する最大件数（オプション、デフォルト: 100）
 */
export const useRooms = ({ propertyId, skip = 0, limit = 100 }: UseRoomsParams) => {
  const axios = useAuthenticatedAxios()

  return useQuery<Room[]>({
    queryKey: ['rooms', propertyId, skip, limit],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required')
      const { data } = await axios.get(ENDPOINTS.GET_ROOMS, {
        params: {
          property_id: propertyId,
          skip,
          limit
        }
      })
      return data
    },
    enabled: !!propertyId,
    retry: false
  })
}