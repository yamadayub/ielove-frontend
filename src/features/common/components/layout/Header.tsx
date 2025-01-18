import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import logo from '../../../../assets/logo.png';

export const Header = () => {
  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="イエラブ" className="h-6 w-auto" />
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg">ielove</span>
              <span className="text-xs text-gray-500">最高の家作りを、みんなで</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
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