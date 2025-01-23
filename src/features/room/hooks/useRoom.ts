import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { Room } from '../types/room_types'

/**
 * 指定されたIDの部屋情報を取得するカスタムフック
 * @param roomId - 部屋ID
 */
export const useRoom = (roomId: string | undefined) => {
  const axios = useAuthenticatedAxios()
  
  return useQuery<Room>({
    queryKey: ['room', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID is required')
      const numericRoomId = parseInt(roomId)
      if (isNaN(numericRoomId)) throw new Error('Invalid room ID')
      const { data } = await axios.get(ENDPOINTS.GET_ROOM(numericRoomId))
      return data
    },
    enabled: !!roomId,
    retry: false
  })
} 