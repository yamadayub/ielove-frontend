import React, { useEffect, useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isLineInAppBrowser } from '../../common/utils/browser';
import { LineInAppBrowserModal } from '../../common/components/modal/LineInAppBrowserModal';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  const afterAuthUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '/mypage';
  const [showLineModal, setShowLineModal] = useState(false);

  useEffect(() => {
    setShowLineModal(isLineInAppBrowser());
  }, []);

  return (
    <>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
        <SignIn 
          routing="path"
          path="/sign-in"
          afterSignInUrl={afterAuthUrl}
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "rounded-xl shadow-sm"
            }
          }}
        />
        <SignUp
          routing="path"
          path="/sign-up"
          afterSignUpUrl={afterAuthUrl}
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "rounded-xl shadow-sm"
            }
          }}
        />
      </div>
      <LineInAppBrowserModal isOpen={showLineModal} />
    </>
  );
}; 