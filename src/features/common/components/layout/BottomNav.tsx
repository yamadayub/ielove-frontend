import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, LogIn } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export const BottomNav = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* ホーム */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-2 ${isActive ? 'text-gray-900' : 'text-gray-500'}`
            }
          >
            <Home className="h-5 w-5" />
          </NavLink>

          {/* 検索 */}
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `p-2 ${isActive ? 'text-gray-900' : 'text-gray-500'}`
            }
          >
            <Search className="h-5 w-5" />
          </NavLink>

          {/* 投稿 */}
          <NavLink
            to="/property/create"
            className={({ isActive }) =>
              `p-2 ${isActive ? 'text-gray-900' : 'text-gray-500'}`
            }
          >
            <PlusSquare className="h-5 w-5" />
          </NavLink>

          {/* お気に入り */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `p-2 ${isActive ? 'text-gray-900' : 'text-gray-500'}`
            }
          >
            <Heart className="h-5 w-5" />
          </NavLink>

          {/* ログイン/マイページ */}
          {isSignedIn ? (
            <NavLink
              to="/mypage"
              className={({ isActive }) =>
                `p-2 ${isActive ? 'text-gray-900' : 'text-gray-500'}`
              }
            >
              <User className="h-5 w-5" />
            </NavLink>
          ) : (
            <NavLink
              to="/sign-in"
              className={({ isActive }) =>
                `p-2 ${isActive ? 'text-gray-900' : 'text-gray-500'}`
              }
            >
              <LogIn className="h-5 w-5" />
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};