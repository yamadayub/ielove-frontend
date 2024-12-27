import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';

export interface Company {
  id: number;
  name: string;
  company_type: 'manufacturer' | 'design' | 'construction';
  created_at: string;
}

interface UseCompaniesParams {
  company_type: 'manufacturer' | 'design' | 'construction';
}

export const useCompanies = ({ company_type }: UseCompaniesParams) => {
  const axios = useAuthenticatedAxios();

  return useQuery<Company[]>({
    queryKey: ['companies', company_type],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.GET_COMPANIES_BY_TYPE(company_type));
      // あいうえお順にソート
      return data.sort((a: Company, b: Company) => a.name.localeCompare(b.name, 'ja'));
    }
  });
}; 