import React from 'react';
import { useStepContext } from '../contexts/StepContext';
import { ALL_PHASES } from '../types';

const MyPageView: React.FC = () => {
  const { steps } = useStepContext();

  const getPhaseProgress = (phase: string) => {
    const phaseSteps = steps.filter(step => step.phase === phase);
    const completedSteps = phaseSteps.filter(step => step.isCompleted);
    return {
      completed: completedSteps.length,
      total: phaseSteps.length,
      percentage: (completedSteps.length / phaseSteps.length) * 100
    };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-primary mb-6">マイページ</h2>
      
      <div className="space-y-6">
        {ALL_PHASES.map(phase => {
          const progress = getPhaseProgress(phase);
          return (
            <div key={phase} className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-primary">{phase}フェーズ</h3>
                <span className="text-sm text-primary-light">
                  {progress.completed}/{progress.total} ステップ
                </span>
              </div>
              <div className="h-4 bg-primary-lighter rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyPageView;