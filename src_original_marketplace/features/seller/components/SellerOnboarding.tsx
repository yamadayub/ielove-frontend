import React, { useState } from 'react';
import { useOnboardingStatus } from '../hooks/useSeller';
import { SellerProfileSchema } from '../types/seller_types';
import { ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useSellerAxios } from '../../shared/api/axios';

interface SellerOnboardingProps {
  sellerProfile: SellerProfileSchema;
}

export const SellerOnboarding: React.FC<SellerOnboardingProps> = ({ sellerProfile }) => {
  const [isStarting, setIsStarting] = useState(false);
  const axios = useSellerAxios();
  const { data: onboardingStatus, isLoading: isStatusLoading } = useOnboardingStatus(sellerProfile.user_id);

  const handleStartOnboarding = async () => {
    setIsStarting(true);
    try {
      const { data } = await axios.post<{ url: string }>(
        '/api/sellers/onboarding/start',
        {
          user_id: sellerProfile.user_id,
        }
      );
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to start onboarding:', error);
    } finally {
      setIsStarting(false);
    }
  };

  if (isStatusLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3 mt-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (isCompleted: boolean) => {
    return isCompleted ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Stripe アカウント設定
        </h3>
        
        {onboardingStatus ? (
          <>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">アカウント情報</span>
                {getStatusIcon(onboardingStatus.details_submitted)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">支払い受け取り設定</span>
                {getStatusIcon(onboardingStatus.payouts_enabled)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">決済受付設定</span>
                {getStatusIcon(onboardingStatus.charges_enabled)}
              </div>
            </div>

            {onboardingStatus?.requirements?.currently_due && onboardingStatus.requirements.currently_due.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      追加の設定が必要です
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {onboardingStatus.requirements.currently_due.map((requirement) => (
                          <li key={requirement}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <button
                type="button"
                onClick={handleStartOnboarding}
                disabled={isStarting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isStarting ? '読み込み中...' : '設定を続ける'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="mt-5">
            <button
              type="button"
              onClick={handleStartOnboarding}
              disabled={isStarting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isStarting ? '読み込み中...' : 'Stripe アカウントを設定する'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 