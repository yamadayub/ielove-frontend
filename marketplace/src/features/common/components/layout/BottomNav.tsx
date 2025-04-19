import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, LogIn } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export const BottomNav = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handlePropertyCreate = () => {
    if (!isSignedIn) {
      const currentUrl = encodeURIComponent('/property/create');
      navigate(`/sign-in?redirect_url=${currentUrl}&from=property_create`);
      return;
    }
    navigate('/property/create');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-5 h-14">
            {/* ホーム */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center ${isActive ? 'text-gray-900' : 'text-gray-500'}`
              }
            >
              <Home className="h-5 w-5" />
              <span className="block text-[10px] mt-1">ホーム</span>
            </NavLink>

            {/* 検索 */}
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center ${isActive ? 'text-gray-900' : 'text-gray-500'}`
              }
            >
              <Search className="h-5 w-5" />
              <span className="block text-[10px] mt-1">検索</span>
            </NavLink>

            {/* 物件追加 */}
            <button
              onClick={handlePropertyCreate}
              className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-900"
            >
              <PlusSquare className="h-5 w-5" />
              <span className="block text-[10px] mt-1">物件追加</span>
            </button>

            {/* お気に入り */}
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center ${isActive ? 'text-gray-900' : 'text-gray-500'}`
              }
            >
              <Heart className="h-5 w-5" />
              <span className="block text-[10px] mt-1">お気に入り</span>
            </NavLink>

            {/* ログイン/マイページ */}
            {isSignedIn ? (
              <NavLink
                to="/mypage"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center ${isActive ? 'text-gray-900' : 'text-gray-500'}`
                }
              >
                <User className="h-5 w-5" />
                <span className="block text-[10px] mt-1">マイページ</span>
              </NavLink>
            ) : (
              <NavLink
                to="/sign-in"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center ${isActive ? 'text-gray-900' : 'text-gray-500'}`
                }
              >
                <LogIn className="h-5 w-5" />
                <span className="block text-[10px] mt-1">ログイン</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};