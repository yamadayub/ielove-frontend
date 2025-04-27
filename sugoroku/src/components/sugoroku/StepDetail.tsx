import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Share2, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Step } from '../../types';

export interface StepDetailProps {
  step: Step;
  userNote: string;
  isLiked: boolean;
  onToggleLike: () => void;
  onShare: () => void;
  onSaveNote: (note: string) => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onClose: () => void;
}

const StepDetail: React.FC<StepDetailProps> = ({
  step,
  userNote,
  isLiked,
  onToggleLike,
  onShare,
  onSaveNote,
  onNavigatePrev,
  onNavigateNext,
  onClose
}) => {
  // モック画像配列（実際のAPIから取得する予定）
  const images = [
    `/images/mock/step_${step.id}_1.jpg`,
    `/images/mock/step_${step.id}_2.jpg`,
    `/images/mock/step_${step.id}_3.jpg`,
  ];

  const [noteContent, setNoteContent] = useState(userNote);
  const [isEditing, setIsEditing] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleSaveNote = () => {
    onSaveNote(noteContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNoteContent(userNote);
    setIsEditing(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // デフォルト画像に置き換え
    target.src = '/images/fallback/default_image.jpg';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      {/* 画像スライダー */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={images[activeImageIndex]}
          alt={`Step ${step.id} image ${activeImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        
        {/* 画像ナビゲーションドット */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeImageIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        )}
        
        {/* 画像ナビゲーションボタン */}
        {activeImageIndex > 0 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1"
            onClick={() => setActiveImageIndex(prev => prev - 1)}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        {activeImageIndex < images.length - 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1"
            onClick={() => setActiveImageIndex(prev => prev + 1)}
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex items-center p-4 border-b">
        <button
          onClick={onToggleLike}
          className={`mr-4 ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
        >
          <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <button onClick={onShare} className="text-gray-700">
          <Share2 size={24} />
        </button>
        
        {/* 前後ステップナビゲーション */}
        <div className="ml-auto flex gap-2">
          <button 
            onClick={onNavigatePrev} 
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={onNavigateNext} 
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ステップ本文 */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-2">{step.title}</h2>
        <p className="text-gray-700 mb-4">
          {step.description || 'このステップの詳細情報がまもなく追加されます。'}
        </p>
        
        <div className="text-sm text-gray-500">
          <p>カテゴリ: {step.category}</p>
          <p>フェーズ: {step.phase}</p>
        </div>
      </div>

      {/* ユーザーメモ */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">あなたのメモ</h3>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="text-primary hover:text-primary-dark"
            >
              <Edit2 size={18} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleCancelEdit} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
              <button 
                onClick={handleSaveNote} 
                className="text-primary hover:text-primary-dark"
              >
                <Save size={18} />
              </button>
            </div>
          )}
        </div>
        
        {!isEditing ? (
          <div className="bg-gray-50 rounded-md p-3 min-h-[100px]">
            {noteContent ? (
              <p className="text-gray-700 whitespace-pre-wrap">{noteContent}</p>
            ) : (
              <p className="text-gray-400 italic">メモはまだありません。「編集」ボタンをクリックして追加してください。</p>
            )}
          </div>
        ) : (
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="このステップについてのメモを書いてください..."
            className="w-full p-3 border rounded-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}
      </div>
    </motion.div>
  );
};

export default StepDetail; 