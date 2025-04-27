import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStepContext } from '../contexts/StepContext';
import StepDetail from '../components/sugoroku/StepDetail';
import NavigationBar from '../components/NavigationBar';
import { UserStep } from '../types';

const StepDetailPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { steps, toggleStepComplete, updateStepNotes } = useStepContext();
  
  const [currentStep, setCurrentStep] = useState<UserStep | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotesView, setIsNotesView] = useState(false);
  
  // stepIdに基づいてステップデータを取得
  useEffect(() => {
    if (!stepId) {
      setError('ステップIDが指定されていません');
      setLoading(false);
      return;
    }
    
    const id = parseInt(stepId, 10);
    if (isNaN(id)) {
      setError('無効なステップIDです');
      setLoading(false);
      return;
    }
    
    const step = steps.find(s => s.id === id);
    if (!step) {
      setError('指定されたステップが見つかりませんでした');
      setLoading(false);
      return;
    }
    
    setCurrentStep(step);
    setLoading(false);
  }, [stepId, steps]);
  
  // 前のステップに移動
  const handleNavigateToPrev = () => {
    if (!currentStep) return;
    
    const currentIndex = steps.findIndex(s => s.id === currentStep.id);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      navigate(`/steps/${prevStep.id}`);
    }
  };
  
  // 次のステップに移動
  const handleNavigateToNext = () => {
    if (!currentStep) return;
    
    const currentIndex = steps.findIndex(s => s.id === currentStep.id);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      navigate(`/steps/${nextStep.id}`);
    }
  };
  
  // メモを保存
  const handleSaveNote = (note: string) => {
    if (currentStep) {
      updateStepNotes(currentStep.id, note);
    }
  };
  
  // いいねの切り替え
  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    // ここに実際のいいね処理を追加（APIとの連携など）
  };
  
  // 共有機能
  const handleShare = () => {
    // モバイルならシェアAPIを使用
    if (navigator.share) {
      navigator.share({
        title: currentStep?.title,
        text: `家づくりステップ: ${currentStep?.title}`,
        url: window.location.href,
      }).catch(err => console.error('シェアに失敗しました', err));
    } else {
      // デスクトップならクリップボードにコピー
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('URLをクリップボードにコピーしました'))
        .catch(err => console.error('コピーに失敗しました', err));
    }
  };
  
  // 閉じる処理
  const handleClose = () => {
    navigate(-1); // ブラウザの戻るボタンと同じ挙動
  };
  
  // ノート表示切り替え
  const handleViewNotes = () => {
    setIsNotesView(!isNotesView);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }
  
  if (error || !currentStep) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pt-16 p-4">
        <h2 className="text-xl font-bold text-red-500 mb-4">エラー</h2>
        <p className="text-center mb-6">{error || 'ステップを読み込めませんでした'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          ホームに戻る
        </button>
      </div>
    );
  }
  
  return (
    <>
      <div className="pt-16 pb-16"> {/* ヘッダーとナビゲーションバーの高さ分の余白を追加 */}
        <StepDetail 
          step={currentStep}
          userNote={currentStep.notes}
          isLiked={isLiked}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
          onSaveNote={handleSaveNote}
          onNavigatePrev={handleNavigateToPrev}
          onNavigateNext={handleNavigateToNext}
          onClose={handleClose}
        />
      </div>
      <NavigationBar onViewNotes={handleViewNotes} isNotesView={isNotesView} />
    </>
  );
};

export default StepDetailPage; 