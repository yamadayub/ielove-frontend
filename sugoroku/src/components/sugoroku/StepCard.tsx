import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Step, StepGroup } from '../../types';

interface StepCardProps {
  step: Step;
  group: StepGroup;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  group,
  isCompleted,
  isCurrent,
  onClick,
}) => {
  const navigate = useNavigate();

  // インスタ風表示に移動する関数
  const goToPostView = (e: React.MouseEvent) => {
    e.stopPropagation(); // カードのクリックイベントを発火させない
    navigate(`/post/${step.id}`);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative border rounded-lg shadow-sm overflow-hidden mb-4
        ${isCurrent ? 'ring-2 ring-blue-500' : ''}
        ${isCompleted ? 'bg-gray-50' : 'bg-white'}
      `}
      onClick={onClick}
    >
      {/* ステップのグループカラーバー */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: group.color }}
      />
      
      {/* ステップ内容 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{step.title}</h3>
          <div className="flex items-center">
            {/* SNS風表示ボタン */}
            <button
              className="mr-2 text-blue-500 hover:text-blue-700"
              onClick={goToPostView}
              title="SNS風表示で見る"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            
            {/* ステップ番号 */}
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium">
              {step.order}
            </span>
            
            {/* 完了マーク */}
            {isCompleted && (
              <div className="ml-2 flex-shrink-0 flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            )}
            
            {/* 現在のステップマーク */}
            {isCurrent && !isCompleted && (
              <div className="ml-2 flex-shrink-0 flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* グループ名 */}
        <p className="text-sm text-gray-500 mb-2">
          {group.name}
        </p>
        
        {/* 説明の冒頭部分 */}
        <p className="text-sm text-gray-700 line-clamp-2">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}; 