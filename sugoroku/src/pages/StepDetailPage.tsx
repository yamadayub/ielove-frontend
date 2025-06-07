import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStepContext } from '../contexts/StepContext';
import StepDetail from '../components/sugoroku/StepDetail';
import NavigationBar from '../components/NavigationBar';
import { sugorokuApi } from '../api/sugorokuApi';
import { UserStep } from '../types/sugoroku';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useUser } from '@clerk/clerk-react';

const StepDetailPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { steps, refreshSteps } = useStepContext();
  const { isSignedIn } = useUser();
  
  const [userStep, setUserStep] = useState<UserStep | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotesView, setIsNotesView] = useState(false);
  
  // stepIdに基づいてステップデータを取得
  useEffect(() => {
    const fetchStepData = async () => {
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
      
      try {
        setLoading(true);
        
        // StepContextからステップを検索
        const foundStep = steps.find(s => s.step_id === id);
        
        if (foundStep) {
          setUserStep(foundStep);
          
          // APIが利用可能な場合はいいね状態を確認
          if (isSignedIn) {
            try {
              const likedStepsResponse = await sugorokuApi.getLikedSteps();
              const isStepLiked = likedStepsResponse.data.some(s => s.step_id === id);
              setIsLiked(isStepLiked);
            } catch (err) {
              console.warn('いいね状態の取得に失敗しました:', err);
              setIsLiked(false);
            }
          }
          setError(null);
        } else {
          setError('指定されたステップが見つかりません');
        }
      } catch (err) {
        console.error('Failed to fetch step data:', err);
        setError('ステップ情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    // stepsが読み込まれてから実行
    if (steps.length > 0) {
      fetchStepData();
    } else if (steps.length === 0) {
      setLoading(true);
    }
  }, [stepId, isSignedIn, steps]);
  
  // 前のステップに移動
  const handleNavigateToPrev = () => {
    if (!userStep || steps.length === 0) return;
    
    // ステップIDでソート
    const sortedSteps = [...steps].sort((a, b) => a.step_id - b.step_id);
    
    const currentIndex = sortedSteps.findIndex(s => s.step_id === userStep.step_id);
    if (currentIndex > 0) {
      const prevStep = sortedSteps[currentIndex - 1];
      navigate(`/steps/${prevStep.step_id}`);
    }
  };
  
  // 次のステップに移動
  const handleNavigateToNext = () => {
    if (!userStep || steps.length === 0) return;
    
    // ステップIDでソート
    const sortedSteps = [...steps].sort((a, b) => a.step_id - b.step_id);
    
    const currentIndex = sortedSteps.findIndex(s => s.step_id === userStep.step_id);
    if (currentIndex < sortedSteps.length - 1) {
      const nextStep = sortedSteps[currentIndex + 1];
      navigate(`/steps/${nextStep.step_id}`);
    }
  };
  
  // メモを保存
  const handleSaveNote = async (note: string) => {
    if (!userStep || !isSignedIn) {
      // 未認証ユーザーの場合はログインページへ誘導
      if (!isSignedIn) {
        navigate('/sign-in', { state: { returnUrl: `/steps/${stepId}` } });
      }
      return;
    }
    
    try {
      // APIが利用可能な場合
      const response = await sugorokuApi.updateStepNotes(userStep.step_id, note);
      setUserStep(response.data);
      
      // コンテキストのデータも更新
      refreshSteps();
    } catch (err) {
      console.warn('APIでのメモ保存に失敗しました。ローカルで更新します:', err);
      
      // APIが失敗した場合はローカルで更新
      const updatedStep = {
        ...userStep,
        notes: note,
        updated_at: new Date().toISOString()
      };
      setUserStep(updatedStep);
    }
  };
  
  // いいねの切り替え
  const handleToggleLike = async () => {
    if (!userStep) return;
    
    // 未認証ユーザーの場合はログインページへ誘導
    if (!isSignedIn) {
      navigate('/sign-in', { state: { returnUrl: `/steps/${stepId}` } });
      return;
    }
    
    try {
      if (isLiked) {
        await sugorokuApi.unlikeStep(userStep.step_id);
      } else {
        await sugorokuApi.likeStep(userStep.step_id);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.warn('いいね機能のAPI呼び出しに失敗しました:', err);
      // APIが失敗してもUIだけ更新（楽観的アップデート）
      setIsLiked(!isLiked);
    }
  };
  
  // 共有機能
  const handleShare = () => {
    if (!userStep) return;
    
    // モバイルならシェアAPIを使用
    if (navigator.share) {
      navigator.share({
        title: userStep.step.title,
        text: `家づくりステップ: ${userStep.step.title}`,
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
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !userStep) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pt-16 p-4">
        <ErrorMessage 
          message={error || 'ステップを読み込めませんでした'} 
          retry={() => {
            setLoading(true);
            setError(null);
            window.location.reload();
          }}
        />
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md mt-4"
        >
          ホームに戻る
        </button>
      </div>
    );
  }
  
  return (
    <>
      <div className="pb-16"> {/* ナビゲーションバーの高さ分の余白を追加 */}
        <StepDetail 
          step={userStep.step}
          userNote={userStep.notes || ''}
          isLiked={isLiked}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
          onSaveNote={handleSaveNote}
          onNavigatePrev={handleNavigateToPrev}
          onNavigateNext={handleNavigateToNext}
          onClose={handleClose}
          isSignedIn={isSignedIn}
        />
      </div>
      <NavigationBar onViewNotes={handleViewNotes} isNotesView={isNotesView} />
    </>
  );
};

export default StepDetailPage; 