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
  const { refreshSteps } = useStepContext();
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
        
        if (isSignedIn) {
          // 認証済みの場合
          try {
            // ユーザーステップ情報を取得
            const userStepsResponse = await sugorokuApi.getUserSteps();
            const foundUserStep = userStepsResponse.data.find(s => s.step_id === id);
            
            if (foundUserStep) {
              setUserStep(foundUserStep);
              
              // いいね状態を確認
              const likedStepsResponse = await sugorokuApi.getLikedSteps();
              const isStepLiked = likedStepsResponse.data.some(s => s.step_id === id);
              setIsLiked(isStepLiked);
            } else {
              // ユーザーステップが見つからない場合は、一般的なステップ情報を取得
              const stepResponse = await sugorokuApi.getStepDetails(id);
              
              // 基本的なステップデータをUserStep形式に変換
              const dummyUserStep: UserStep = {
                id: 0,
                user_id: 0,
                step_id: stepResponse.data.id,
                is_completed: false,
                completed_at: null,
                notes: null,
                created_at: new Date().toISOString(),
                updated_at: null,
                step: stepResponse.data
              };
              
              setUserStep(dummyUserStep);
            }
          } catch (err) {
            console.error('Failed to fetch user step:', err);
            // ユーザーステップの取得に失敗した場合のフォールバック
            const stepResponse = await sugorokuApi.getStepDetails(id);
            setUserStep({
              id: 0,
              user_id: 0,
              step_id: stepResponse.data.id,
              is_completed: false,
              completed_at: null,
              notes: null,
              created_at: new Date().toISOString(),
              updated_at: null,
              step: stepResponse.data
            });
          }
        } else {
          // 未認証の場合は公開ステップ情報のみ取得
          const stepResponse = await sugorokuApi.getStepDetails(id);
          
          setUserStep({
            id: 0,
            user_id: 0,
            step_id: stepResponse.data.id,
            is_completed: false,
            completed_at: null,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: null,
            step: stepResponse.data
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch step data:', err);
        setError('ステップ情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStepData();
  }, [stepId, isSignedIn]);
  
  // 前のステップに移動
  const handleNavigateToPrev = async () => {
    if (!userStep) return;
    
    try {
      const response = await sugorokuApi.getSteps();
      const allSteps = response.data;
      
      // ステップIDでソート
      allSteps.sort((a, b) => a.id - b.id);
      
      const currentIndex = allSteps.findIndex(s => s.id === userStep.step.id);
      if (currentIndex > 0) {
        const prevStep = allSteps[currentIndex - 1];
        navigate(`/steps/${prevStep.id}`);
      }
    } catch (err) {
      console.error('Failed to navigate to previous step:', err);
      setError('前のステップへの移動に失敗しました');
    }
  };
  
  // 次のステップに移動
  const handleNavigateToNext = async () => {
    if (!userStep) return;
    
    try {
      const response = await sugorokuApi.getSteps();
      const allSteps = response.data;
      
      // ステップIDでソート
      allSteps.sort((a, b) => a.id - b.id);
      
      const currentIndex = allSteps.findIndex(s => s.id === userStep.step.id);
      if (currentIndex < allSteps.length - 1) {
        const nextStep = allSteps[currentIndex + 1];
        navigate(`/steps/${nextStep.id}`);
      }
    } catch (err) {
      console.error('Failed to navigate to next step:', err);
      setError('次のステップへの移動に失敗しました');
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
      const response = await sugorokuApi.updateStepNotes(userStep.step_id, note);
      setUserStep(response.data);
      
      // コンテキストのデータも更新
      refreshSteps();
    } catch (err) {
      console.error('Failed to save note:', err);
      setError('メモの保存に失敗しました');
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
      console.error('Failed to toggle like:', err);
      setError('いいねの操作に失敗しました');
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