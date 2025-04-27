import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StepProvider, useStepContext } from './contexts/StepContext';
import Header from './components/Header';
import TimelineView from './views/TimelineView';
import GridView from './views/GridView';
import BoardGameView from './views/BoardGameView';
import NavigationBar from './components/NavigationBar';
import NotesView from './views/NotesView';
import MyPageView from './views/MyPageView';
import StepDetailPage from './pages/StepDetailPage';

// BASE_PATHはvite.config.tsのbaseに合わせる
const BASE_PATH = '/sugoroku';

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

// アプリコンテナ
const AppContent: React.FC = () => {
  // 常にヘッダーを表示する
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/steps/:stepId" element={<StepDetailPage />} />
          {/* リダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router basename={BASE_PATH}>
      <StepProvider>
        <AppContent />
      </StepProvider>
    </Router>
  );
};

export default App;