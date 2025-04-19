import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { Button } from '../components/ui/Button';
import { StepGroup } from '../types';
import { handleImageError } from '../utils/imageUtils';

export const PostGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { steps, stepGroups, isLoading } = useSugoroku();
  
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // フィルタリングされたステップ
  const filteredSteps = steps
    .filter(step => 
      (selectedGroupId === null || step.groupId === selectedGroupId) &&
      (searchQuery === '' || 
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => a.order - b.order);
  
  // ステップをクリックしたときの処理
  const handleStepClick = (stepId: number) => {
    navigate(`/post/${stepId}`);
  };
  
  // グループを選択したときの処理
  const handleGroupSelect = (groupId: number | null) => {
    setSelectedGroupId(groupId);
  };
  
  // スゴロクボードに戻る
  const handleBackToSugoroku = () => {
    navigate('/');
  };
  
  // 画像読み込みエラー時の処理
  const handleLocalImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, groupId: number) => {
    handleImageError(e, groupId);
  };
  
  // グループのステップ数とその完了数を取得する関数
  const getGroupStats = (group: StepGroup) => {
    const groupSteps = steps.filter(step => step.groupId === group.id);
    return {
      total: groupSteps.length,
      order: group.order
    };
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
  
  return (
    <div className="min-h-screen pt-16 pb-14 bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* プロフィールヘッダー風 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center">
              {/* プロフィール画像部分 */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-4 md:mb-0 md:mr-8 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              
              {/* プロフィール情報部分 */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">家づくりスゴロク</h1>
                <p className="text-gray-600 mb-2">@ieduukuri_sugoroku</p>
                <p className="mb-4">家づくりの100ステップを美しく解説。理想の家づくりをサポートします。</p>
                <div className="flex justify-center md:justify-start space-x-4 text-sm">
                  <span><b>100</b> 投稿</span>
                  <span><b>4</b> フェーズ</span>
                  <span><b>1000+</b> フォロワー</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* フィルターとアクション */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* 検索フィールド */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ステップを検索..."
                  className="px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg 
                  className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* 戻るボタン */}
              <Button
                variant="primary"
                size="sm"
                onClick={handleBackToSugoroku}
              >
                スゴロクに戻る
              </Button>
            </div>
            
            {/* グループフィルター */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedGroupId === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleGroupSelect(null)}
              >
                すべて
              </button>
              
              {stepGroups.map(group => (
                <button
                  key={group.id}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedGroupId === group.id
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: selectedGroupId === group.id ? group.color : undefined
                  }}
                  onClick={() => handleGroupSelect(group.id)}
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>
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
              合計ステップ数: {steps.filter(s => s.groupId === selectedGroupId).length}
            </p>
          </div>
        )}
        
        {/* 投稿グリッド */}
        {filteredSteps.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {filteredSteps.map(step => {
              const group = stepGroups.find(g => g.id === step.groupId)!;
              return (
                <div
                  key={step.id}
                  className="aspect-square bg-gray-200 relative cursor-pointer"
                  onClick={() => handleStepClick(step.id)}
                >
                  <img 
                    src={`/images/mock/step_${step.id}_1.jpg`}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleLocalImageError(e, step.groupId)}
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity text-white flex flex-col items-center">
                      <span className="text-lg font-bold">{step.order}</span>
                      <span className="text-xs">{step.title}</span>
                    </div>
                  </div>
                  {/* 右上のステップ番号バッジ */}
                  <div className="absolute top-2 right-2 bg-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                    {step.order}
                  </div>
                  {/* 左上のグループインジケーター */}
                  <div 
                    className="absolute top-0 left-0 h-1 w-1/3"
                    style={{ backgroundColor: group.color }}
                  ></div>
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
            {searchQuery && (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setSearchQuery('')}
              >
                検索をクリア
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 