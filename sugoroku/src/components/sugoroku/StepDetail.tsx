import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Share2, Edit2, Save, X, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Step } from '../../types/sugoroku';

export interface StepDetailProps {
  step: Step;
  userNote: string;
  isLiked: boolean;
  isSignedIn?: boolean;
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
  isSignedIn = false,
  onToggleLike,
  onShare,
  onSaveNote,
  onNavigatePrev,
  onNavigateNext,
  onClose
}) => {
  // ステップの画像を取得
  const getStepImages = () => {
    // APIから取得した画像がない場合はフォールバック画像を設定
    if (!step.images || step.images.length === 0) {
      return [`/images/mock/step_${step.id}_1.jpg`];
    }
    
    // 画像タイプでソート
    const sortedImages = [...step.images].sort((a, b) => {
      // タイプで優先度ソート：title -> detail -> gallery
      const typeOrder: Record<string, number> = { title: 1, detail: 2, gallery: 3 };
      const orderA = typeOrder[a.image_type] || 99;
      const orderB = typeOrder[b.image_type] || 99;
      
      if (orderA !== orderB) return orderA - orderB;
      
      // 同じタイプならorder属性でソート
      return a.order - b.order;
    });
    
    return sortedImages.map(img => img.image_url);
  };

  const images = getStepImages();
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

  // カテゴリー情報（グループ名を使用）
  const getCategoryName = () => {
    return step.group_id ? `グループ ${step.group_id}` : '未分類';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      {/* ヘッダーと戻るボタン */}
      <div className="px-4 py-3 border-b flex items-center">
        <button
          onClick={onClose}
          className="text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base ml-4">Step {step.id}</h1>
      </div>

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
        {isSignedIn ? (
          // 認証済みユーザー向けのいいねボタン
          <button
            onClick={onToggleLike}
            className={`mr-4 ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        ) : (
          // 未認証ユーザー向けのログインボタン
          <button
            onClick={onToggleLike}
            className="mr-4 text-gray-700 flex items-center"
            title="いいねするにはログインが必要です"
          >
            <LogIn size={22} className="mr-1" />
            <Heart size={20} />
          </button>
        )}
        
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
          <p>カテゴリ: {getCategoryName()}</p>
          <p>フェーズ: {step.phase}</p>
          <p>いいね: {step.like_count || 0}</p>
        </div>
      </div>

      {/* ユーザーメモ */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">あなたのメモ</h3>
          {isSignedIn ? (
            // 認証済みユーザー向けの編集ボタン
            !isEditing ? (
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
            )
          ) : (
            // 未認証ユーザー向けのログインボタン
            <button 
              onClick={() => onSaveNote('')} 
              className="text-primary hover:text-primary-dark flex items-center"
              title="メモを追加するにはログインが必要です"
            >
              <LogIn size={16} className="mr-1" />
              <span className="text-xs">ログイン</span>
            </button>
          )}
        </div>
        
        {isSignedIn ? (
          // 認証済みユーザー向けのメモ表示
          !isEditing ? (
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
          )
        ) : (
          // 未認証ユーザー向けのメッセージ
          <div className="bg-gray-50 rounded-md p-3 min-h-[100px] flex items-center justify-center">
            <p className="text-gray-500 text-center">
              メモ機能を使用するには<br />
              <span className="text-primary font-semibold">ログイン</span>が必要です
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StepDetail; 