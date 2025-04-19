import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { Button } from '../components/ui/Button';

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { steps, stepGroups, userProgress, isLoading, error } = useSugoroku();

  // グループごとの完了率を計算
  const groupProgress = useMemo(() => {
    if (!userProgress || steps.length === 0 || stepGroups.length === 0) {
      return [];
    }

    return stepGroups.map(group => {
      const groupSteps = steps.filter(step => step.groupId === group.id);
      const completedGroupSteps = groupSteps.filter(step => 
        userProgress.completedSteps.includes(step.id)
      );
      
      const completionRate = groupSteps.length > 0
        ? Math.round((completedGroupSteps.length / groupSteps.length) * 100)
        : 0;
      
      return {
        group,
        total: groupSteps.length,
        completed: completedGroupSteps.length,
        completionRate
      };
    }).sort((a, b) => a.group.order - b.group.order);
  }, [steps, stepGroups, userProgress]);

  // 全体の完了率
  const totalCompletionRate = useMemo(() => {
    if (!userProgress || steps.length === 0) return 0;
    return Math.round((userProgress.completedSteps.length / steps.length) * 100);
  }, [steps, userProgress]);

  // 現在のステップ
  const currentStep = useMemo(() => {
    if (!userProgress || steps.length === 0) return null;
    return steps.find(step => step.id === userProgress.currentStep) || null;
  }, [steps, userProgress]);

  // 現在のステップのグループ
  const currentGroup = useMemo(() => {
    if (!currentStep || stepGroups.length === 0) return null;
    return stepGroups.find(group => group.id === currentStep.groupId) || null;
  }, [currentStep, stepGroups]);

  // 最後の更新日
  const lastUpdatedDate = useMemo(() => {
    if (!userProgress || !userProgress.lastUpdated) return null;
    return new Date(userProgress.lastUpdated).toLocaleString('ja-JP');
  }, [userProgress]);

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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-14 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mt-4 mb-6">進捗状況</h1>
        
        {/* 全体の進捗 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">全体の進捗</h2>
          <div className="mb-2 flex justify-between">
            <span>完了: {userProgress?.completedSteps.length || 0} / {steps.length} ステップ</span>
            <span className="font-bold">{totalCompletionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${totalCompletionRate}%` }}
            ></div>
          </div>
          {lastUpdatedDate && (
            <p className="text-xs text-gray-500 mt-2">最終更新: {lastUpdatedDate}</p>
          )}
        </div>
        
        {/* 現在のステップ */}
        {currentStep && currentGroup && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-lg font-medium mb-3">現在のステップ</h2>
            <div
              className="w-full rounded-t-lg h-1 mb-3"
              style={{ backgroundColor: currentGroup.color }}
            ></div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">{currentGroup.name}</p>
                <h3 className="text-lg font-medium">{currentStep.title}</h3>
              </div>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium">
                {currentStep.order}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4">{currentStep.description}</p>
            <Button
              variant="primary"
              onClick={() => navigate(`/step/${currentStep.id}`)}
              isFullWidth
            >
              このステップに移動
            </Button>
          </div>
        )}
        
        {/* グループごとの進捗 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">フェーズごとの進捗</h2>
          {groupProgress.map(({ group, total, completed, completionRate }) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{group.name}</h3>
                <span className="text-sm font-bold">{completionRate}%</span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                完了: {completed} / {total} ステップ
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{ 
                    width: `${completionRate}%`,
                    backgroundColor: group.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 