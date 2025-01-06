import React from 'react';
import { SellerProfileSchema } from '../types/seller_types';
import { useOnboardingStatus } from '../hooks/useSeller';
import { SellerOnboarding } from './SellerOnboarding';
import { ShoppingBag, DollarSign, Package } from 'lucide-react';

interface SellerDashboardProps {
  sellerProfile: SellerProfileSchema;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ sellerProfile }) => {
  const { data: onboardingStatus } = useOnboardingStatus(sellerProfile.user_id);

  // Stripeオンボーディングが完了していない場合は、オンボーディングコンポーネントを表示
  if (!onboardingStatus?.charges_enabled || !onboardingStatus?.payouts_enabled) {
    return <SellerOnboarding sellerProfile={sellerProfile} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    総注文数
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    総売上
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">¥0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    登録商品数
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 