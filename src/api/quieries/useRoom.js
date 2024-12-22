import { useQuery } from '@tanstack/react-query'
import axios from '../axios'
import { ENDPOINTS } from '../endpoints'

const API_URL = import.meta.env.VITE_APP_BACKEND_URL

/**
 * @param {string} [roomId]
 * @returns {import('@tanstack/react-query').UseQueryResult<import('../../types/room').Room>}
 */
export const useRoom = (roomId) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID is required')
      const { data } = await axios.get(`${API_URL}${ENDPOINTS.GET_ROOM(roomId)}`)
      return data
    },
    enabled: !!roomId,
    retry: false
  })
} 