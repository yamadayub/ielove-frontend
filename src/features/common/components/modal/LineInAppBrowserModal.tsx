import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LineInAppBrowserModalProps {
  isOpen: boolean;
}

export const LineInAppBrowserModal: React.FC<LineInAppBrowserModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

        <div className="relative inline-block w-full max-w-sm p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ExternalLink className="h-12 w-12 text-gray-900" />
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
              外部ブラウザでページを開いてください
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                アプリ内のブラウザではGoogleログインができないため、右下のメニューから「ブラウザで開く」を選択してアクセスしてください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 