import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Home } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const CustomHomeIcon = () => (
  <div className="relative">
    <Home className="h-6 w-6 text-gray-900" />
    <Heart className="absolute -bottom-1 -right-1 h-3 w-3 text-red-500" />
  </div>
);

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-2">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-2">
            <CustomHomeIcon />
            <span className="font-semibold text-xl">イエラブ</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Search className="h-6 w-6 text-gray-900" />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link
                to="/sign-in"
                className="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                ログイン
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};