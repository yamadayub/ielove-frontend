import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, retry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center w-full max-w-md mx-auto">
      <div className="flex justify-center mb-2">
        <AlertTriangle className="text-red-500 h-8 w-8" />
      </div>
      <h3 className="text-red-800 font-medium mb-2">エラーが発生しました</h3>
      <p className="text-red-700 text-sm mb-4">{message || 'データの取得に失敗しました。'}</p>
      
      {retry && (
        <button
          onClick={retry}
          className="bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-md text-sm transition-colors"
        >
          再試行
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 