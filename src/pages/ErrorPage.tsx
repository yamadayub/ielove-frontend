import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  message?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message ?? 'エラーが発生しました';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">エラー</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          トップページへ戻る
        </button>
      </div>
    </div>
  );
}; 