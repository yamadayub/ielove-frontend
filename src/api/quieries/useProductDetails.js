import { useQuery } from '@tanstack/react-query'
import axios from '../axios'
import { ENDPOINTS } from '../endpoints'
import { useAuth } from '@clerk/clerk-react'

export function useProductDetails(productId) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['productDetails', productId],
    queryFn: async () => {
      try {
        console.log('Fetching product details:', {
          productId,
          userId,
          url: `${ENDPOINTS.GET_PRODUCT_DETAILS(productId)}?clerk_user_id=${userId}`
        });

        const { data } = await axios.get(
          `${ENDPOINTS.GET_PRODUCT_DETAILS(productId)}?clerk_user_id=${userId}`
        );

        console.log('Product details response:', data);
        return data;
      } catch (error) {
        console.error('Error fetching product details:', {
          error,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        throw error;
      }
    },
    enabled: !!productId && !!userId
  });
}