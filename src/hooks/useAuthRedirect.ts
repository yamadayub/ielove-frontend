import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthRedirect = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  return { handleAuthSuccess };
}; 