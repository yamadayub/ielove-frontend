import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { Step, StepGroup } from '../types';
import { Button } from '../components/ui/Button';
import { handleImageError } from '../utils/imageUtils';

export const GridViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { steps, stepGroups, userProgress, isLoading, error } = useSugoroku();
  
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // グループフィルタリングとテキスト検索の処理
  useEffect(() => {
    if (steps.length > 0) {
      let stepsToShow = [...steps].sort((a, b) => a.order - b.order);
      
      // グループフィルター
      if (selectedGroupId !== null) {
        stepsToShow = stepsToShow.filter(step => step.groupId === selectedGroupId);
      }
      
      // テキスト検索
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        stepsToShow = stepsToShow.filter(step => 
          step.title.toLowerCase().includes(query) || 
          step.description.toLowerCase().includes(query)
        );
      }
      
      setFilteredSteps(stepsToShow);
    }
  }, [steps, selectedGroupId, searchQuery]);

  // ステップをクリックしたときの処理
  const handleStepClick = (stepId: number) => {
    navigate(`/post/${stepId}`);
  };

  // 各表示モードへの切り替え
  const handleSwitchToSugoroku = () => {
    navigate('/');
  };
  
  const handleSwitchToTimeline = () => {
    navigate('/timeline');
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
    <div className="min-h-screen pt-16 pb-14 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* プロフィールヘッダー風 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 mt-4">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center">
              {/* プロフィールアイコン */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-4 md:mb-0 md:mr-8 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              
              {/* プロフィール情報 */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">家づくりスゴロク</h1>
                <p className="text-gray-600 mb-2">@ieduukuri_sugoroku</p>
                <p className="mb-4">家づくりの100ステップを美しく解説。理想の家づくりをサポートします。</p>
                <div className="flex justify-center md:justify-start space-x-4 text-sm">
                  <span><b>{steps.length}</b> 投稿</span>
                  <span><b>{stepGroups.length}</b> フェーズ</span>
                  <span><b>{userProgress?.completedSteps.length || 0}</b> 完了</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 表示切替ボタン */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwitchToSugoroku}
                >
                  スゴロク表示
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwitchToTimeline}
                >
                  タイムライン表示
                </Button>
              </div>
              
              {/* 検索ボックス */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ステップを検索..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg 
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* グループフィルター */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 whitespace-nowrap">
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
        
        {/* グループの説明 */}
        {selectedGroupId !== null && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">
              {stepGroups.find(g => g.id === selectedGroupId)?.name}
            </h2>
            <p className="text-gray-700">
              {stepGroups.find(g => g.id === selectedGroupId)?.description}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              表示中のステップ: {filteredSteps.length} / 合計ステップ数: {steps.filter(s => s.groupId === selectedGroupId).length}
            </p>
          </div>
        )}
        
        {/* グリッド表示 */}
        {filteredSteps.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {filteredSteps.map(step => {
              const group = stepGroups.find(g => g.id === step.groupId)!;
              
              return (
                <div
                  key={step.id}
                  className="aspect-square bg-gray-100 relative cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleStepClick(step.id)}
                >
                  <img 
                    src={`/images/mock/step_${step.id}_1.jpg`}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleLocalImageError(e, step.groupId)}
                  />
                  
                  {/* オーバーレイとホバー効果 */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center text-white">
                      <span className="text-lg font-bold">Step {step.order}</span>
                    </div>
                  </div>
                  
                  {/* 右上のステップ番号バッジ */}
                  <div className="absolute top-2 right-2 bg-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-sm">
                    {step.order}
                  </div>
                  
                  {/* 左上のグループカラーインジケーター */}
                  <div 
                    className="absolute top-0 left-0 h-1 w-1/3"
                    style={{ backgroundColor: group.color }}
                  ></div>
                  
                  {/* 完了マーク */}
                  {isStepCompleted(step.id) && (
                    <div className="absolute bottom-2 right-2">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">見つかりませんでした</h3>
            <p className="text-gray-500">
              検索条件に一致するステップがありません。別のキーワードを試すか、フィルターをリセットしてください。
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              {searchQuery && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => setSearchQuery('')}
                >
                  検索をクリア
                </button>
              )}
              {selectedGroupId !== null && (
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  onClick={() => setSelectedGroupId(null)}
                >
                  フィルターをクリア
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 