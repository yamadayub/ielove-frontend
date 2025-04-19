import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { NotesPage } from './pages/NotesPage';
import { ProgressPage } from './pages/ProgressPage';
import { AboutPage } from './pages/AboutPage';
import { StepDetailPage } from './pages/StepDetailPage';
import { StepPostPage } from './pages/StepPostPage';
import { SugorokuProvider } from './hooks/useSugorokuContext';

// ダミーユーザーID (実際にはユーザー認証機能を実装する)
const DUMMY_USER_ID = 'user123';

// React QueryのクライアントインスタンスをAP宣言
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5分
    },
  },
});

// vite.config.tsのbaseと一致させる必要がある
const BASE_PATH = '/sugoroku';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SugorokuProvider userId={DUMMY_USER_ID}>
        <Router basename={BASE_PATH}>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pb-16">
              <Routes>
                {/* メインビュー */}
                <Route path="/" element={<HomePage />} />
                <Route path="/step/:stepId" element={<HomePage />} />
                <Route path="/group/:groupId" element={<HomePage />} />
                
                {/* 古いビューのリダイレクト */}
                <Route path="/timeline" element={<Navigate to="/" replace />} />
                <Route path="/grid" element={<Navigate to="/" replace />} />
                
                {/* 詳細ビュー */}
                <Route path="/step-detail/:stepId" element={<StepDetailPage />} />
                <Route path="/post/:stepId" element={<StepPostPage />} />
                
                {/* その他ページ */}
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/mypage" element={<Navigate to="/progress" replace />} />
                <Route path="/about" element={<AboutPage />} />
                
                {/* リダイレクト */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SugorokuProvider>
    </QueryClientProvider>
  );
}

export default App; 