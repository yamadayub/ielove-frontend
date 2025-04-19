import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <button 
      onClick={handleSignOut}
      className="text-red-600 hover:text-red-800"
    >
      ログアウト
    </button>
  );
}; 