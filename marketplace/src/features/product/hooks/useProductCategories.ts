import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedAxios } from '../../shared/api/axios'
import type { ProductCategory } from '../types/product_types'

/**
 * 製品カテゴリ一覧を取得するカスタムフック
 */
export const useProductCategories = () => {
  const axios = useAuthenticatedAxios()

  return useQuery<ProductCategory[]>({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/product-categories')
      return data
    }
  })
} 