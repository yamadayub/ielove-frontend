import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { Button } from '../components/ui/Button';

export const StepPostPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { getStepById, stepGroups } = useSugoroku();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // 数値のstepIdを取得
  const numericStepId = stepId ? parseInt(stepId, 10) : null;
  
  // ステップデータの取得
  const step = numericStepId ? getStepById(numericStepId) : undefined;
  
  // ステップのグループ情報を取得
  const group = step ? stepGroups.find(g => g.id === step.groupId) : undefined;
  
  // 画像パスの生成
  const imagePaths = numericStepId 
    ? [
        `/images/mock/step_${numericStepId}_1.jpg`,
        `/images/mock/step_${numericStepId}_2.jpg`
      ]
    : [];
  
  // ロード状態の管理
  useEffect(() => {
    if (step && group) {
      setIsLoading(false);
    }
  }, [step, group]);
  
  // 画像ロードエラー処理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const fallbackCategory = step?.groupId === 1 ? 'planning' :
                            step?.groupId === 2 ? 'design' :
                            step?.groupId === 3 ? 'construction' : 'completion';
    target.src = `/images/fallback/${fallbackCategory}_${activeImageIndex + 1}.jpg`;
    target.onerror = null; // 無限ループ防止
  };
  
  // スゴロクページに戻る
  const handleBackToSugoroku = () => {
    navigate('/');
  };
  
  // 投稿のキャプションを生成
  const generateCaption = (index: number) => {
    if (!step) return '';
    
    if (index === 0) {
      return `【家づくりステップ ${step.order}】${step.title}\n\n${step.description}`;
    } else {
      return `【家づくりアドバイス ${step.order}】${step.title}\n\nこのステップでのポイント：\n${step.description}`;
    }
  };
  
  // 次のステップを表示
  const goToNextStep = () => {
    if (numericStepId) {
      const nextStepId = numericStepId + 1;
      if (nextStepId <= 100) { // 最大ステップ数が100と仮定
        navigate(`/post/${nextStepId}`);
        setActiveImageIndex(0); // 最初の画像に戻す
      }
    }
  };
  
  // 前のステップを表示
  const goToPrevStep = () => {
    if (numericStepId && numericStepId > 1) {
      const prevStepId = numericStepId - 1;
      navigate(`/post/${prevStepId}`);
      setActiveImageIndex(0); // 最初の画像に戻す
    }
  };
  
  if (isLoading || !step || !group) {
    return (
      <div className="min-h-screen pt-16 pb-14 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16 pb-14 bg-gray-50">
      <div className="max-w-xl mx-auto p-4">
        {/* インスタ風カード */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* ヘッダー */}
          <div className="flex items-center p-4 border-b">
            <div 
              className="w-10 h-10 rounded-full mr-3"
              style={{ backgroundColor: group.color }}
            />
            <div>
              <h3 className="font-semibold">家づくりスゴロク</h3>
              <p className="text-xs text-gray-500">{group.name}</p>
            </div>
          </div>
          
          {/* 画像エリア */}
          <div className="relative aspect-square bg-black">
            {imagePaths.map((path, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === activeImageIndex ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={path}
                  alt={`ステップ ${step.order} の画像 ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={handleImageError}
                />
              </motion.div>
            ))}
            
            {/* 画像ナビゲーション */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
              {imagePaths.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`画像 ${index + 1} を表示`}
                />
              ))}
            </div>
            
            {/* 左右の矢印 */}
            <button
              className="absolute left-4 inset-y-1/2 transform -translate-y-1/2 bg-white/30 rounded-full p-2"
              onClick={() => setActiveImageIndex(prev => (prev === 0 ? imagePaths.length - 1 : prev - 1))}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-4 inset-y-1/2 transform -translate-y-1/2 bg-white/30 rounded-full p-2"
              onClick={() => setActiveImageIndex(prev => (prev === imagePaths.length - 1 ? 0 : prev + 1))}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* アクションバー */}
          <div className="flex justify-between p-4 border-b">
            <div className="flex space-x-4">
              <button className="focus:outline-none">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="focus:outline-none">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button className="focus:outline-none">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            <button className="focus:outline-none">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
          
          {/* キャプション */}
          <div className="p-4">
            <p className="font-semibold mb-1">家づくりスゴロク</p>
            <p className="whitespace-pre-line">{generateCaption(activeImageIndex)}</p>
            <p className="text-gray-500 text-sm mt-2">
              #{group.name.replace(/[（）]/g, '').replace(/\s+/g, '')} 
              #家づくり 
              #マイホーム計画 
              #住宅設計 
              #家づくりスゴロク
              #ステップ{step.order}
            </p>
          </div>
        </div>
        
        {/* ナビゲーションボタン */}
        <div className="flex justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={goToPrevStep}
            disabled={numericStepId === 1}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            前のステップ
          </Button>
          <Button 
            variant="outline" 
            onClick={goToNextStep}
            disabled={numericStepId === 100}
            rightIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            次のステップ
          </Button>
        </div>
        
        {/* アプリに戻るボタン */}
        <div className="text-center">
          <Button
            variant="primary"
            onClick={handleBackToSugoroku}
          >
            スゴロクに戻る
          </Button>
        </div>
        
        {/* 関連ステップ */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">関連ステップ</h2>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(offset => {
              const relatedStepId = Math.min(Math.max(1, (numericStepId || 1) + offset), 100);
              return (
                <div 
                  key={offset}
                  className="aspect-square bg-gray-200 rounded overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/post/${relatedStepId}`)}
                >
                  <img 
                    src={`/images/mock/step_${relatedStepId}_1.jpg`}
                    alt={`ステップ ${relatedStepId}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/fallback/planning_1.jpg';
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 