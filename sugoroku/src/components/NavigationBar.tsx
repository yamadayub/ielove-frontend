import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, LayoutList, FileText, User } from 'lucide-react';
import { useStepContext } from '../contexts/StepContext';
import { ViewMode } from '../types';

const NavigationBar: React.FC<{ onViewNotes: () => void, isNotesView: boolean }> = ({ 
  onViewNotes, 
  isNotesView 
}) => {
  const { viewMode, setViewMode } = useStepContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 詳細ページにいるかどうかを確認
  const isDetailPage = location.pathname.startsWith('/steps/');

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    
    // 詳細ページにいる場合は、ホームページに戻る
    if (isDetailPage) {
      navigate('/');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10 w-full">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => {
            handleViewChange('boardGame');
            if (isNotesView) onViewNotes();
          }}
          className={`p-4 ${
            viewMode === 'boardGame' && !isNotesView && !isDetailPage
              ? 'text-primary'
              : 'text-primary-light'
          }`}
          aria-label="スゴロク表示"
        >
          <Home size={24} />
        </button>
        
        <button
          onClick={() => {
            handleViewChange('timeline');
            if (isNotesView) onViewNotes();
          }}
          className={`p-4 ${
            viewMode === 'timeline' && !isNotesView && !isDetailPage
              ? 'text-primary'
              : 'text-primary-light'
          }`}
          aria-label="タイムライン表示"
        >
          <LayoutList size={24} />
        </button>
        
        <button
          onClick={() => {
            handleViewChange('grid');
            if (isNotesView) onViewNotes();
          }}
          className={`p-4 ${
            viewMode === 'grid' && !isNotesView && !isDetailPage
              ? 'text-primary'
              : 'text-primary-light'
          }`}
          aria-label="グリッド表示"
        >
          <Grid size={24} />
        </button>
        
        <button
          onClick={() => {
            if (isDetailPage) {
              navigate('/');
              // メモ一覧に移動するためのフラグを設定
              setTimeout(() => onViewNotes(), 100);
            } else {
              onViewNotes();
            }
          }}
          className={`p-4 ${
            isNotesView && !isDetailPage
              ? 'text-primary'
              : 'text-primary-light'
          }`}
          aria-label="メモ一覧"
        >
          <FileText size={24} />
        </button>

        <button
          onClick={() => {
            handleViewChange('mypage');
            if (isNotesView) onViewNotes();
          }}
          className={`p-4 ${
            viewMode === 'mypage' && !isNotesView && !isDetailPage
              ? 'text-primary'
              : 'text-primary-light'
          }`}
          aria-label="マイページ"
        >
          <User size={24} />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;