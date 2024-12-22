import { useQuery } from '@tanstack/react-query'
import axios from '../axios'
import { ENDPOINTS } from '../endpoints'

const API_URL = import.meta.env.VITE_APP_BACKEND_URL

export const useProperty = (propertyId) => {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required')
      const { data } = await axios.get(`${API_URL}${ENDPOINTS.GET_PROPERTY(propertyId)}`)
      return data
    },
    enabled: !!propertyId,
    retry: false
  })
}