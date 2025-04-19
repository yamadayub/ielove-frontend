import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  
  // 現在のルートをチェックしてアクティブ状態を設定する関数
  const isActive = (path: string): string => {
    if (path === '/' && (location.pathname === '/' || location.pathname.startsWith('/step/') || location.pathname.startsWith('/group/'))) {
      return 'text-blue-600';
    }
    return location.pathname === path ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900';
  };
  
  return (
    <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14">
          {/* フッターナビゲーション */}
          <div className="grid grid-cols-3 w-full max-w-md mx-auto">
            <Link
              to="/"
              className={`${isActive('/')} flex flex-col items-center justify-center`}
              aria-label="ホーム"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>

            <Link
              to="/notes"
              className={`${isActive('/notes')} flex flex-col items-center justify-center`}
              aria-label="メモ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>

            <Link
              to="/progress"
              className={`${isActive('/progress')} flex flex-col items-center justify-center`}
              aria-label="マイページ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}; 