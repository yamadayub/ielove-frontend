import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SugorokuBoard } from '../components/sugoroku/SugorokuBoard';
import { StepDetail } from '../components/sugoroku/StepDetail';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { parseDeepLink } from '../utils/deepLinkUtils';
import { handleImageError } from '../utils/imageUtils';
import { Step, StepGroup } from '../types';
import { Button } from '../components/ui/Button';

// ビューモードの型定義
type ViewMode = 'sugoroku' | 'timeline' | 'grid';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    steps,
    stepGroups,
    userNotes,
    userProgress,
    isLoading,
    error,
    getStepById,
    getNoteForStep,
    markStepComplete,
    markStepIncomplete,
    saveNote,
    moveToStep,
  } = useSugoroku();

  // ビューモードの状態
  const [viewMode, setViewMode] = useState<ViewMode>('sugoroku');
  
  // グリッド・タイムライン用の状態
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // スゴロク用の状態
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [selectedStepGroup, setSelectedStepGroup] = useState<StepGroup | null>(null);

  // グループフィルタリングとテキスト検索の処理
  useEffect(() => {
    if (steps.length > 0) {
      let stepsToShow = [...steps].sort((a, b) => a.order - b.order);
      
      // グループフィルター
      if (selectedGroupId !== null) {
        stepsToShow = stepsToShow.filter(step => step.groupId === selectedGroupId);
      }
      
      // テキスト検索 (グリッドビュー用)
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

  // ディープリンクからのアクセスを処理
  useEffect(() => {
    if (steps.length === 0 || stepGroups.length === 0) return;

    const { stepId, groupId } = parseDeepLink(location.pathname + location.search);
    
    if (stepId) {
      setSelectedStepId(stepId);
      moveToStep(stepId);
      // ステップの詳細表示の場合はスゴロクビューを選択
      setViewMode('sugoroku');
    } else if (groupId) {
      // グループの最初のステップを選択
      const groupSteps = steps.filter(step => step.groupId === groupId).sort((a, b) => a.order - b.order);
      if (groupSteps.length > 0) {
        setSelectedStepId(groupSteps[0].id);
        moveToStep(groupSteps[0].id);
      }
      setSelectedGroupId(groupId);
    } else if (userProgress && userProgress.currentStep) {
      // ユーザーの現在のステップを選択
      setSelectedStepId(userProgress.currentStep);
    }
  }, [steps, stepGroups, location, userProgress, moveToStep]);

  // 選択したステップが変更されたとき、そのステップとグループの情報を取得
  useEffect(() => {
    if (!selectedStepId || steps.length === 0 || stepGroups.length === 0) return;
    
    const step = getStepById(selectedStepId);
    if (step) {
      setSelectedStep(step);
      const group = stepGroups.find(g => g.id === step.groupId);
      if (group) {
        setSelectedStepGroup(group);
      }
    }
  }, [selectedStepId, steps, stepGroups, getStepById]);

  // ステップを選択したときの処理
  const handleSelectStep = (stepId: number) => {
    setSelectedStepId(stepId);
    moveToStep(stepId);
    
    // URLを更新（ヒストリーに追加）
    navigate(`/step/${stepId}`, { replace: true });
    
    // スゴロクビューに切り替え
    setViewMode('sugoroku');
  };

  // 前のステップに移動
  const handleNavigateToPrev = () => {
    if (!selectedStep) return;
    
    const prevStep = steps
      .filter(s => s.order < selectedStep.order)
      .sort((a, b) => b.order - a.order)[0];
    
    if (prevStep) {
      handleSelectStep(prevStep.id);
    }
  };

  // 次のステップに移動
  const handleNavigateToNext = () => {
    if (!selectedStep) return;
    
    const nextStep = steps
      .filter(s => s.order > selectedStep.order)
      .sort((a, b) => a.order - b.order)[0];
    
    if (nextStep) {
      handleSelectStep(nextStep.id);
    }
  };

  // ノートを保存
  const handleSaveNote = async (content: string) => {
    if (!selectedStepId) return;
    await saveNote(selectedStepId, content);
  };

  // ステップを完了としてマーク
  const handleMarkComplete = async () => {
    if (!selectedStepId) return;
    await markStepComplete(selectedStepId);
  };

  // ステップを未完了としてマーク
  const handleMarkIncomplete = async () => {
    if (!selectedStepId) return;
    await markStepIncomplete(selectedStepId);
  };

  // ステップの完了状態を確認
  const isStepCompleted = (stepId: number): boolean => {
    return userProgress?.completedSteps.includes(stepId) || false;
  };

  // 画像読み込みエラー時の処理
  const handleLocalImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, groupId: number) => {
    handleImageError(e, groupId);
  };

  // ステップの投稿詳細を表示
  const handleViewPostDetail = (stepId: number) => {
    navigate(`/post/${stepId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-14 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 pb-14 px-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // 前後のステップを取得
  const getPrevStep = (): Step | undefined => {
    if (!selectedStep) return undefined;
    return steps.find(s => s.order === selectedStep.order - 1);
  };

  const getNextStep = (): Step | undefined => {
    if (!selectedStep) return undefined;
    return steps.find(s => s.order === selectedStep.order + 1);
  };

  return (
    <div className="min-h-screen pt-16 pb-14 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* ビューモード切替タブ */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-4">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center font-medium flex flex-col items-center justify-center ${
                viewMode === 'sugoroku'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setViewMode('sugoroku')}
            >
              <svg 
                className="w-6 h-6 mb-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 5v14M5 12h14"
                />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="5" r="2" fill="currentColor" />
                <circle cx="12" cy="19" r="2" fill="currentColor" />
              </svg>
              <span className="text-xs">スゴロク</span>
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium flex flex-col items-center justify-center ${
                viewMode === 'timeline'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setViewMode('timeline')}
            >
              <svg 
                className="w-6 h-6 mb-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span className="text-xs">タイムライン</span>
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium flex flex-col items-center justify-center ${
                viewMode === 'grid'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <svg 
                className="w-6 h-6 mb-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              <span className="text-xs">グリッド</span>
            </button>
          </div>

          {/* グリッドビューとタイムラインビュー用のフィルター */}
          {(viewMode === 'grid' || viewMode === 'timeline') && (
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-2 mb-2">
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

              {/* グリッドビュー用の検索ボックス */}
              {viewMode === 'grid' && (
                <div className="relative mt-3">
                  <input
                    type="text"
                    placeholder="ステップを検索..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              )}
            </div>
          )}
        </div>

        {/* スゴロクビュー */}
        {viewMode === 'sugoroku' && (
          <div className="pb-20">
            {/* 選択中のステップ詳細を表示 */}
            {selectedStep && selectedStepGroup && (
              <div className="mb-8">
                <StepDetail
                  step={selectedStep}
                  group={selectedStepGroup}
                  prevStep={getPrevStep()}
                  nextStep={getNextStep()}
                  userNote={getNoteForStep(selectedStep.id)}
                  isCompleted={userProgress?.completedSteps.includes(selectedStep.id) || false}
                  onSaveNote={handleSaveNote}
                  onMarkComplete={handleMarkComplete}
                  onMarkIncomplete={handleMarkIncomplete}
                  onNavigateToPrev={handleNavigateToPrev}
                  onNavigateToNext={handleNavigateToNext}
                />
              </div>
            )}

            {/* スゴロクボード（全ステップの一覧） */}
            <SugorokuBoard
              onSelectStep={handleSelectStep}
              selectedStepId={selectedStepId}
            />
          </div>
        )}

        {/* タイムラインビュー */}
        {viewMode === 'timeline' && (
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
                      <button className="focus:outline-none" onClick={() => handleSelectStep(step.id)}>
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
                    
                    {/* 詳細を見るボタン */}
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        isFullWidth
                        onClick={() => handleSelectStep(step.id)}
                      >
                        詳細を見る
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

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
        )}

        {/* グリッドビュー */}
        {viewMode === 'grid' && (
          <>
            {/* グリッド表示 */}
            {filteredSteps.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-1">
                {filteredSteps.map(step => {
                  const group = stepGroups.find(g => g.id === step.groupId)!;
                  
                  return (
                    <div
                      key={step.id}
                      className="aspect-square bg-gray-100 relative cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleSelectStep(step.id)}
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
              <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">表示するステップがありません</h3>
                <p className="text-gray-500">
                  このフィルター条件に一致するステップがありません。別のフィルターを選択するか、検索キーワードを変更してください。
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => {
                      setSelectedGroupId(null);
                      setSearchQuery('');
                    }}
                  >
                    すべて表示
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 