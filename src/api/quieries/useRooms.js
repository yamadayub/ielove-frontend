import { useQuery } from '@tanstack/react-query'
import axios from '../axios'
import { ENDPOINTS } from '../endpoints'

export const useRooms = (propertyId) => {
  return useQuery({
    queryKey: ['rooms', propertyId],
    queryFn: async () => {
      const { data } = await axios.get(`${ENDPOINTS.GET_ROOMS(propertyId)}`)
      return data
    },
    enabled: !!propertyId
  })
}