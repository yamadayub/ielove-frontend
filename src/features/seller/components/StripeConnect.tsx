import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useSellerAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { isAxiosError } from 'axios';
import { useSellerProfile, useStripeStatus } from '../hooks/useSeller';
import { useUser } from '../../user/hooks/useUser';

interface StripeConnectProps {
  userId: number;
  stripeAccountId: string | null;
  accountStatus: string | null;
  onboardingCompleted: boolean;
  isLoading: boolean;
}

interface StripeAccountLink {
  url: string;
  expires_at: number;
}

export const StripeConnect: React.FC<StripeConnectProps> = ({
  userId,
  stripeAccountId,
  accountStatus,
  onboardingCompleted,
  isLoading,
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const axios = useSellerAxios();
  const { data: userProfile } = useUser(userId);
  const { refetch: refetchProfile } = useSellerProfile(userId);
  const { refetch: refetchStatus } = useStripeStatus(userId, stripeAccountId);

  const startOnboarding = async () => {
    try {
      setIsStarting(true);
      const response = await axios.post<StripeAccountLink>(
        ENDPOINTS.SELLER.START_ONBOARDING,
        {
          display_name: userProfile?.name || 'Unknown User'
        }
      );
      // オンボーディング開始後にプロフィールとステータスを更新
      await Promise.all([refetchProfile(), refetchStatus()]);
      window.location.href = response.data.url;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.error('Failed to start onboarding:', {
          status: error.response.status,
          data: error.response.data
        });
      } else {
        console.error('Failed to start onboarding:', error);
      }
    } finally {
      setIsStarting(false);
    }
  };

  const openDashboard = async () => {
    try {
      setIsLoadingDashboard(true);
      const response = await axios.get<{ url: string }>(
        ENDPOINTS.SELLER.GET_DASHBOARD_URL
      );
      window.open(response.data.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.error('Failed to get dashboard URL:', {
          status: error.response.status,
          data: error.response.data
        });
      } else {
        console.error('Failed to get dashboard URL:', error);
      }
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3 mt-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Stripe接続状況
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          {!stripeAccountId ? (
            <p>
              商品を出品するには、Stripeアカウントとの接続が必要です。
              以下のボタンをクリックして、Stripeアカウントの接続を開始してください。
            </p>
          ) : !onboardingCompleted ? (
            <p>
              Stripeアカウントの接続は開始されましたが、まだ完了していません。
              以下のボタンをクリックして、接続作業を完了させてください。
            </p>
          ) : (
            <p>
              Stripeアカウントが正常に接続されています。
              商品の出品が可能です。
            </p>
          )}
        </div>
        <div className="mt-5 space-x-4">
          {!stripeAccountId || !onboardingCompleted ? (
            <button
              type="button"
              onClick={startOnboarding}
              disabled={isStarting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  処理中...
                </>
              ) : !stripeAccountId ? (
                'Stripeアカウントを接続'
              ) : (
                'Stripe接続を完了する'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={openDashboard}
              disabled={isLoadingDashboard}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {isLoadingDashboard ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  読み込み中...
                </>
              ) : (
                <>
                  Stripeダッシュボードを開く
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 