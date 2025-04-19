export type StripeAccountStatus = 'pending' | 'active' | 'restricted' | 'rejected';
export type StripeAccountType = 'standard' | 'express' | 'custom';

export interface SellerProfileSchema {
  id: number;
  user_id: number;
  stripe_account_id: string | null;
  stripe_account_status: string | null;
  stripe_onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StripeOnboardingStatus {
  account_id: string;
  status: string;
  onboarding_completed: boolean;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: string[];
  };
} 