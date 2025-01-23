import React from 'react';
import { Link } from 'react-router-dom';

export const LegalInformation = () => {
  return (
    <div className="bg-white rounded-lg">
      <div className="border-t border-gray-100">
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <Link
            to="/terms"
            className="py-4 text-center text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            利用規約
          </Link>
          <Link
            to="/privacy"
            className="py-4 text-center text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            プライバシーポリシー
          </Link>
        </div>
        <div className="border-t border-gray-100">
          <Link
            to="/commercial-law"
            className="block py-4 text-center text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            特定商取引法に基づく表記
          </Link>
        </div>
      </div>
    </div>
  );
}; 