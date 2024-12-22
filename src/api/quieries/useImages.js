import { useQuery } from '@tanstack/react-query'
import axios from '../axios'
import { ENDPOINTS } from '../endpoints'

export const useImages = ({ entity_type, entity_id }) => {
  console.log('🔍 useImages called with:', { entity_type, entity_id })

  return useQuery({
    queryKey: ['images', entity_type, entity_id],
    queryFn: async () => {
      try {
        console.log('📡 Making request to:', ENDPOINTS.GET_IMAGES, { entity_type, entity_id })
        const { data } = await axios.get(ENDPOINTS.GET_IMAGES, {
          params: { entity_type, entity_id }
        })
        console.log('✅ Response data:', data)
        return data
      } catch (error) {
        console.error('❌ Request failed:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        })
        throw error
      }
    },
    enabled: Boolean(entity_type && entity_id)
  })
}