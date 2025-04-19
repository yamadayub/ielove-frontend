import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  alt = '画像'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-5xl px-2">
          <button
            type="button"
            className="absolute -top-10 right-2 text-white/80 hover:text-white focus:outline-none transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="w-full"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 