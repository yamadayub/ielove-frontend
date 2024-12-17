import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, UserCircle } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-around h-14 md:h-16">
          <Link to="/" className="flex flex-col items-center justify-center w-1/5">
            <Home className={`h-5 w-5 md:h-6 md:w-6 ${isActive('/') ? 'text-black' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">ホーム</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center justify-center w-1/5">
            <Search className={`h-5 w-5 md:h-6 md:w-6 ${isActive('/search') ? 'text-black' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">検索</span>
          </Link>
          <Link to="/property/create" className="flex flex-col items-center justify-center w-1/5">
            <PlusSquare className={`h-5 w-5 md:h-6 md:w-6 ${isActive('/property/create') ? 'text-black' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">投稿</span>
          </Link>
          <Link to="/favorites" className="flex flex-col items-center justify-center w-1/5">
            <Heart className={`h-5 w-5 md:h-6 md:w-6 ${isActive('/favorites') ? 'text-black' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">お気に入り</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center justify-center w-1/5">
            <UserCircle className={`h-5 w-5 md:h-6 md:w-6 ${isActive('/mypage') ? 'text-black' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">マイページ</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};