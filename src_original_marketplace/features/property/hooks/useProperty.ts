import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { Property } from '../types/property_types'

export const useProperty = (propertyId: string | undefined) => {
  const axios = useAuthenticatedAxios()

  return useQuery<Property>({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required')
      const { data } = await axios.get(ENDPOINTS.GET_PROPERTY(propertyId))
      return data
    },
    enabled: !!propertyId,
    retry: false
  })
}