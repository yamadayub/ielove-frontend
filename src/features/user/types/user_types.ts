export interface User {
  id: number;
  clerk_user_id: string;
  email: string;
  name: string;
  user_type: 'individual';
  role: 'buyer' | 'seller' | 'both';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
} 