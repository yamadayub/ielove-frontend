import { useClerk } from '@clerk/clerk-react';

export const AuthError = () => {
  const { client } = useClerk();

  return (
    <div className="text-center py-8">
      <h2 className="text-red-600">認証エラーが発生しました</h2>
      <button
        onClick={() => client.reload()}
        className="mt-4 text-blue-600 hover:text-blue-800"
      >
        再試行
      </button>
    </div>
  );
}; 