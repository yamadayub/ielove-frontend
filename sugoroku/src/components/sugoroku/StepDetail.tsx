import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Step, StepGroup, UserNote } from '../../types';
import { Button } from '../ui/Button';

interface StepDetailProps {
  step: Step;
  group: StepGroup;
  prevStep?: Step;
  nextStep?: Step;
  userNote?: UserNote;
  isCompleted: boolean;
  onSaveNote: (content: string) => void;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  onNavigateToPrev: () => void;
  onNavigateToNext: () => void;
}

export const StepDetail: React.FC<StepDetailProps> = ({
  step,
  group,
  prevStep,
  nextStep,
  userNote,
  isCompleted,
  onSaveNote,
  onMarkComplete,
  onMarkIncomplete,
  onNavigateToPrev,
  onNavigateToNext,
}) => {
  const [noteContent, setNoteContent] = useState(userNote?.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleSaveNote = () => {
    onSaveNote(noteContent);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* ヘッダー部分 */}
      <div 
        className="py-3 px-4 border-b"
        style={{ backgroundColor: group.color + '20' }} // グループカラーを薄く背景に
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{step.title}</h2>
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-sm font-medium">
            {step.order}
          </span>
        </div>
        <p className="text-sm text-gray-600">{group.name}</p>
      </div>

      {/* 画像スライダー */}
      <div className="relative w-full">
        {step.images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === activeImageIndex ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: index === activeImageIndex ? 'block' : 'none' }}
          >
            <img
              src={image}
              alt={`ステップ ${step.order} の画像 ${index + 1}`}
              className="w-full h-auto object-contain"
              onError={(e) => {
                // 画像ロードエラー時にフォールバック画像を設定
                const target = e.target as HTMLImageElement;
                const fallbackCategory = step.groupId === 1 ? 'planning' :
                                        step.groupId === 2 ? 'design' :
                                        step.groupId === 3 ? 'construction' : 'completion';
                target.src = `/images/fallback/${fallbackCategory}_${index + 1}.jpg`;
                target.onerror = null; // 無限ループ防止
              }}
            />
            <div className="p-2 bg-gray-100 text-center text-sm text-gray-700">
              {index === 0 ? 
                `${step.title}の扉画像` : 
                `${step.title}のアドバイス・参考画像`}
            </div>
          </motion.div>
        ))}
        
        {/* 画像ナビゲーション */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          {step.images.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full mx-1 ${
                index === activeImageIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onClick={() => setActiveImageIndex(index)}
              aria-label={`画像 ${index + 1} を表示`}
            />
          ))}
        </div>
      </div>

      {/* 説明文 */}
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-medium mb-2">説明</h3>
        <p className="text-gray-700">{step.description}</p>
      </div>

      {/* ユーザーメモ */}
      <div className="px-4 py-3 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">メモ</h3>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              {userNote ? '編集' : '追加'}
            </Button>
          )}
        </div>

        {isEditing ? (
          <div>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="メモを入力してください..."
            />
            <div className="flex justify-end mt-2 space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setNoteContent(userNote?.content || '');
                }}
              >
                キャンセル
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveNote}
              >
                保存
              </Button>
            </div>
          </div>
        ) : userNote ? (
          <p className="text-gray-700 whitespace-pre-wrap">{userNote.content}</p>
        ) : (
          <p className="text-gray-500 italic">メモはまだありません</p>
        )}
      </div>

      {/* アクションボタン */}
      <div className="px-4 py-3 flex justify-between">
        <div className="flex space-x-2">
          {prevStep && (
            <Button
              variant="outline"
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              }
              onClick={onNavigateToPrev}
            >
              前へ
            </Button>
          )}
          {nextStep && (
            <Button
              variant="outline"
              rightIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              }
              onClick={onNavigateToNext}
            >
              次へ
            </Button>
          )}
        </div>
        {isCompleted ? (
          <Button
            variant="secondary"
            onClick={onMarkIncomplete}
          >
            未完了にする
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onMarkComplete}
          >
            完了にする
          </Button>
        )}
      </div>
    </div>
  );
}; 