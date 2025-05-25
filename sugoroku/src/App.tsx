import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StepProvider, useStepContext } from './contexts/StepContext';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import Header from './components/Header';
import TimelineView from './views/TimelineView';
import GridView from './views/GridView';
import BoardGameView from './views/BoardGameView';
import NavigationBar from './components/NavigationBar';
import NotesView from './views/NotesView';
import MyPageView from './views/MyPageView';
import StepDetailPage from './pages/StepDetailPage';
import { setClerkUser } from './api/apiClient';

// BASE_PATHはvite.config.tsのbaseに合わせる
const BASE_PATH = '/sugoroku';

// Clerkの公開キー（環境変数から取得）
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// ユーザー認証管理コンポーネント
const AuthManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      // ユーザーがログインしている場合、そのIDをAPIクライアントに設定
      setClerkUser(user.id);
      console.log('認証: ユーザーID設定完了', user.id);
    }
  }, [user]);
  
  return <>{children}</>;
};

// メインコンテンツ（ホーム画面）
const MainContent: React.FC = () => {
  const { viewMode } = useStepContext();
  const [isNotesView, setIsNotesView] = useState(false);

  const handleViewNotes = () => {
    setIsNotesView(!isNotesView);
  };

  if (isNotesView) {
    return (
      <>
        <NotesView />
        <NavigationBar onViewNotes={handleViewNotes} isNotesView={isNotesView} />
      </>
    );
  }

  return (
    <>
      {viewMode === 'timeline' && <TimelineView />}
      {viewMode === 'grid' && <GridView />}
      {viewMode === 'boardGame' && <BoardGameView />}
      {viewMode === 'mypage' && <MyPageView />}
      <NavigationBar onViewNotes={handleViewNotes} isNotesView={isNotesView} />
    </>
  );
};

// ルートにアクセス制限を適用
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

// アプリコンテナ
const AppContent: React.FC = () => {
  // 常にヘッダーを表示する
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            // ホーム画面は認証が不要
            <MainContent />
          } />
          <Route path="/steps/:stepId" element={
            // ステップ詳細画面は認証不要に変更（メモやいいねなどの機能は詳細ページ内で制限）
            <StepDetailPage />
          } />
          {/* リダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  if (!clerkPubKey) {
    console.warn('Clerk公開キーが設定されていません！');
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthManager>
        <Router basename={BASE_PATH}>
          <StepProvider>
            <AppContent />
          </StepProvider>
        </Router>
      </AuthManager>
    </ClerkProvider>
  );
};

export default App;