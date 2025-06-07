import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, User, Home, Box, MessageSquare, FileText, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'ietsuku';
    if (path === '/property-type') return 'ietsuku';
    if (path === '/property-info') return 'ietsuku';
    if (path === '/floor-plan-editor') return 'ietsuku';
    if (path === '/3d-view') return 'ietsuku';
    return 'ietsuku';
  };

  const getBackAction = () => {
    const path = location.pathname;
    if (path === '/property-type') return () => navigate('/');
    if (path === '/property-info') return () => navigate('/property-type');
    if (path === '/floor-plan-editor') return () => navigate('/property-info');
    if (path === '/3d-view') return () => navigate('/floor-plan-editor');
    return null;
  };

  const showBackButton = () => {
    return !['/dashboard', '/'].includes(location.pathname);
  };

  const isActive3D = location.pathname === '/3d-view';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー - 画面上部に固定 */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          {/* 左側 - バック/メニューボタン */}
          <button 
            onClick={showBackButton() ? getBackAction() || undefined : undefined}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent"
            title={showBackButton() ? "戻る" : "メニュー"}
          >
            {showBackButton() ? (
              <ArrowLeft className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          
          {/* 中央 - ブランド名 */}
          <h1 className="text-xl font-bold text-gray-900">{getHeaderTitle()}</h1>
          
          {/* 右側 - ユーザーアイコン */}
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent">
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* メインコンテンツエリア */}
      <main className="pt-16 pb-20" style={{ minHeight: '100vh' }}>
        {children}
      </main>

      {/* フッター - 画面下部に固定 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-10">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* ホーム */}
          <button 
            onClick={() => navigate('/')}
            className="p-3 text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent"
          >
            <Home className="w-6 h-6" />
          </button>
          
          {/* ３D表示 */}
          <button 
            className={`p-3 border-none bg-transparent transition-colors ${isActive3D ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Box className="w-6 h-6" />
          </button>
          
          {/* メッセージ */}
          <button className="p-3 text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent">
            <MessageSquare className="w-6 h-6" />
          </button>
          
          {/* ファイル一覧 */}
          <button className="p-3 text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent">
            <FileText className="w-6 h-6" />
          </button>
          
          {/* マイページ */}
          <button className="p-3 text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent">
            <User className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 