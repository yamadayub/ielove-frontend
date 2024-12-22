import { useQuery } from '@tanstack/react-query'
import axios from '../axios'
import { ENDPOINTS } from '../endpoints'

const API_URL = import.meta.env.VITE_APP_BACKEND_URL

/**
 * @typedef {Object} UseProductsParams
 * @property {string} [roomId]
 */

/**
 * @param {UseProductsParams} params
 * @returns {import('@tanstack/react-query').UseQueryResult<import('../../types/product').Product[]>}
 */
export const useProducts = ({ roomId }) => {
  return useQuery({
    queryKey: ['products', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID is required')

      const { data } = await axios.get(`${API_URL}${ENDPOINTS.GET_PRODUCTS}`, {
        params: { room_id: roomId }
      })
      return data
    },
    enabled: !!roomId,
    retry: false
  })
}