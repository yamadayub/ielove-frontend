import React from 'react';
import { SignUp, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const createUserProfile = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/users`, 
        {
          // ユーザー初期データ
          user_type: 'individual',
          role: 'buyer'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to create user profile:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <SignUp 
        routing="path" 
        path="/sign-up"
        afterSignUpUrl="/mypage"
        redirectUrl={`${window.location.origin}/mypage`}
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-xl shadow-sm"
          }
        }}
        onSignUpComplete={createUserProfile}
      />
    </div>
  );
}; 