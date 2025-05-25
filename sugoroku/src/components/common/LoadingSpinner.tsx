import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  // サイズに応じたクラス設定
  const sizeClass = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  }[size];

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClass} border-t-primary border-primary/30 rounded-full animate-spin`}
        role="status"
        aria-label="読み込み中"
      />
      <span className="sr-only">読み込み中...</span>
    </div>
  );
};

export default LoadingSpinner; 