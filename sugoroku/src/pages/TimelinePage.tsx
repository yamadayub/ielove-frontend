import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { Step, StepGroup } from '../types';
import { Button } from '../components/ui/Button';
import { handleImageError } from '../utils/imageUtils';

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { steps, stepGroups, userProgress, isLoading, error } = useSugoroku();
  
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);
  
  // ステップをフィルタリングする処理
  useEffect(() => {
    if (steps.length > 0) {
      let stepsToShow = [...steps].sort((a, b) => a.order - b.order);
      
      if (selectedGroupId !== null) {
        stepsToShow = stepsToShow.filter(step => step.groupId === selectedGroupId);
      }
      
      setFilteredSteps(stepsToShow);
    }
  }, [steps, selectedGroupId]);
  
  // 特定のステップに移動
  const handleViewStepDetail = (stepId: number) => {
    navigate(`/step/${stepId}`);
  };
  
  // インスタ風の投稿詳細ページに移動
  const handleViewPostDetail = (stepId: number) => {
    navigate(`/post/${stepId}`);
  };
  
  // ステップの完了状態をチェック
  const isStepCompleted = (stepId: number): boolean => {
    return userProgress?.completedSteps.includes(stepId) || false;
  };
  
  // 画像読み込みエラー時の処理
  const handleLocalImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, groupId: number) => {
    handleImageError(e, groupId);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-14 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen pt-16 pb-14 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16 pb-20 bg-gray-50">
      <div className="max-w-xl mx-auto px-4">
        {/* ページヘッダー */}
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold">家づくりタイムライン</h1>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/grid')}
            >
              グリッド表示
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              スゴロク表示
            </Button>
          </div>
        </div>
        
        {/* グループフィルター */}
        <div className="flex flex-wrap gap-2 mb-6 sticky top-16 bg-gray-50 py-2 z-10">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedGroupId === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedGroupId(null)}
          >
            すべて
          </button>
          
          {stepGroups.map(group => (
            <button
              key={group.id}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedGroupId === group.id
                  ? 'text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              style={{ 
                backgroundColor: selectedGroupId === group.id ? group.color : undefined
              }}
              onClick={() => setSelectedGroupId(group.id)}
            >
              {group.name}
            </button>
          ))}
        </div>
        
        {/* タイムラインコンテンツ */}
        <div className="space-y-6">
          {filteredSteps.map(step => {
            const group = stepGroups.find(g => g.id === step.groupId)!;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* カードヘッダー */}
                <div className="flex items-center p-4 border-b">
                  <div 
                    className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: group.color }}
                  >
                    {step.order}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-xs text-gray-500">{group.name}</p>
                  </div>
                  {isStepCompleted(step.id) && (
                    <div className="ml-auto">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
                
                {/* メイン画像 */}
                <div className="relative aspect-square bg-gray-100" onClick={() => handleViewPostDetail(step.id)}>
                  <img 
                    src={`/images/mock/step_${step.id}_1.jpg`}
                    alt={step.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onError={(e) => handleLocalImageError(e, step.groupId)}
                  />
                </div>
                
                {/* アクションバー */}
                <div className="flex justify-between p-4 border-b">
                  <div className="flex space-x-4">
                    <button className="focus:outline-none">
                      <svg className="w-7 h-7" fill={isStepCompleted(step.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="focus:outline-none" onClick={() => handleViewStepDetail(step.id)}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button className="focus:outline-none" onClick={() => handleViewPostDetail(step.id)}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <button className="focus:outline-none">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                
                {/* コンテンツ */}
                <div className="p-4">
                  <p className="font-semibold mb-1">ステップ {step.order}</p>
                  <p className="text-sm mb-3">{step.description}</p>
                  
                  {/* タグとハッシュタグ */}
                  <p className="text-gray-500 text-sm">
                    #{group.name.replace(/[（）]/g, '').replace(/\s+/g, '')} 
                    #家づくり 
                    #マイホーム計画 
                    #住宅設計 
                    #家づくりスゴロク
                    #ステップ{step.order}
                  </p>
                  
                  {/* 詳細を見るボタン */}
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      isFullWidth
                      onClick={() => handleViewStepDetail(step.id)}
                    >
                      詳細を見る
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* 何も表示されない場合 */}
        {filteredSteps.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">表示するステップがありません</h3>
            <p className="text-gray-500">
              このフィルター条件に一致するステップがありません。別のフィルターを選択してください。
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setSelectedGroupId(null)}
            >
              すべて表示
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 