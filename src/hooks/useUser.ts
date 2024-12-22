import { useUser, useAuth } from '@clerk/clerk-react';

export const useUserInfo = () => {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();

  return {
    user,
    isSignedIn,
    isLoaded,
    email: user?.primaryEmailAddress?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    imageUrl: user?.imageUrl,
  };
}; 