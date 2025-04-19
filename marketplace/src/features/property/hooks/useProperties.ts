import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import { ENDPOINTS } from '../../shared/api/endpoints'
import type { Property } from '../types/property_types'

interface UsePropertiesParams {
  skip?: number
  limit?: number
}

/**
 * 物件一覧を取得するカスタムフック
 * @param params.skip - スキップする件数（オプション、デフォルト: 0）
 * @param params.limit - 取得する最大件数（オプション、デフォルト: 100）
 */
export const useProperties = ({ skip = 0, limit = 100 }: UsePropertiesParams = {}) => {
  const axios = useAuthenticatedAxios()

  return useQuery<Property[]>({
    queryKey: ['properties', { skip, limit }],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.GET_PROPERTIES, {
        params: { skip, limit }
      })
      return data
    },
    retry: false
  })
}

/**
 * ユーザーに紐づく物件一覧を取得するカスタムフック
 * @param userId - ユーザーID
 * @param params.skip - スキップする件数（オプション、デフォルト: 0）
 * @param params.limit - 取得する最大件数（オプション、デフォルト: 100）
 */
export const useUserProperties = (
  userId: number,
  { skip = 0, limit = 100 }: UsePropertiesParams = {}
) => {
  const axios = useAuthenticatedAxios()

  return useQuery<Property[]>({
    queryKey: ['userProperties', userId, { skip, limit }],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.GET_USER_PROPERTIES(userId), {
        params: { skip, limit }
      })
      return data
    },
    retry: false,
    enabled: !!userId
  })
}