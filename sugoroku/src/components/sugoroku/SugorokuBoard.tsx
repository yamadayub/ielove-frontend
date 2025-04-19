import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Step, StepGroup } from '../../types';
import { StepCard } from './StepCard';
import { useSugoroku } from '../../hooks/useSugorokuContext';

interface SugorokuBoardProps {
  onSelectStep: (stepId: number) => void;
  selectedStepId?: number | null;
}

export const SugorokuBoard: React.FC<SugorokuBoardProps> = ({
  onSelectStep,
  selectedStepId,
}) => {
  const {
    steps,
    stepGroups,
    userProgress,
  } = useSugoroku();

  const [organizedSteps, setOrganizedSteps] = useState<{
    group: StepGroup;
    steps: Step[];
  }[]>([]);

  // ステップをグループごとに整理
  useEffect(() => {
    if (steps.length > 0 && stepGroups.length > 0) {
      const sortedGroups = [...stepGroups].sort((a, b) => a.order - b.order);
      
      const organized = sortedGroups.map(group => {
        const groupSteps = steps
          .filter(step => step.groupId === group.id)
          .sort((a, b) => a.order - b.order);
        
        return {
          group,
          steps: groupSteps
        };
      });
      
      setOrganizedSteps(organized);
    }
  }, [steps, stepGroups]);

  // ステップの完了状態を確認
  const isStepCompleted = (stepId: number): boolean => {
    return userProgress?.completedSteps.includes(stepId) || false;
  };

  // 現在のステップかどうかを確認
  const isCurrentStep = (stepId: number): boolean => {
    return userProgress?.currentStep === stepId;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto pb-20">
      {/* メインの線（中央の縦線） */}
      <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-1 bg-gray-300" />

      {organizedSteps.map(({ group, steps: groupSteps }) => (
        <div key={group.id} className="mb-8">
          {/* グループヘッダー */}
          <div className="relative mb-4">
            <div className="flex items-center ml-8 sm:ml-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-10 px-4 py-2 rounded-full font-bold text-white shadow-md"
                style={{ backgroundColor: group.color }}
              >
                {group.name}
              </motion.div>
            </div>
          </div>

          {/* グループ内のステップ */}
          <div className="space-y-8">
            {groupSteps.map((step) => {
              return (
                <div key={step.id} className="flex">
                  {/* すべてのステップカードを右側に配置 */}
                  <div className="relative w-4/5 ml-auto">
                    {/* 横線 (ステップカードと中央縦線を接続) */}
                    <div 
                      className="absolute top-1/2 right-full h-1 bg-gray-300"
                      style={{ width: '2rem', transform: 'translateY(-50%)' }}
                    />
                    
                    {/* ステップを表すポイント */}
                    <div
                      className={`
                        absolute top-1/2 right-full transform -translate-y-1/2
                        mr-[-12px]
                        w-6 h-6 rounded-full border-4 border-white shadow-sm z-10
                      `}
                      style={{ 
                        backgroundColor: isStepCompleted(step.id) ? group.color : 'white',
                        borderColor: isCurrentStep(step.id) ? 'rgb(59, 130, 246)' : 'white',
                        borderWidth: isCurrentStep(step.id) ? '3px' : '2px'
                      }}
                    />
                    
                    {/* ステップカード */}
                    <StepCard
                      step={step}
                      group={group}
                      isCompleted={isStepCompleted(step.id)}
                      isCurrent={step.id === selectedStepId || isCurrentStep(step.id)}
                      onClick={() => onSelectStep(step.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}; 