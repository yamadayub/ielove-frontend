import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <SignIn 
        routing="path" 
        path="/sign-in"
        afterSignInUrl="/mypage"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-xl shadow-sm"
          }
        }}
      />
    </div>
  );
}; 