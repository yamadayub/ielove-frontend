import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Image } from '../../image/types/image_types';

interface RoomGalleryProps {
  images: Image[];
  roomName: string;
  isPurchased?: boolean;
  isOwner?: boolean;
}

export const RoomGallery: React.FC<RoomGalleryProps> = ({ 
  images, 
  roomName,
  isPurchased = false,
  isOwner = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 画像がPAIDで、未購入かつ所有者でない場合にブラー効果を適用
  const shouldBlur = (image: Image) => {
    return image.image_type === 'PAID' && (!isPurchased && !isOwner);
  };

  useEffect(() => {
    const mainImageIndex = images.findIndex(img => img.image_type === 'MAIN');
    if (mainImageIndex !== -1) {
      setCurrentIndex(mainImageIndex);
      scrollTo(mainImageIndex);
    }
  }, [images]);

  if (images.length === 0) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      setCurrentIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-black">
      <div 
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        <div className="flex">
          {images.map((image, index) => (
            <div key={image.id} className="flex-none w-full snap-start">
              <div className="aspect-square md:aspect-[4/3] relative">
                <img
                  src={image.url}
                  alt={image.description || `${roomName} - ${image.image_type === 'MAIN' ? 'メイン画像' : `画像 ${index + 1}`}`}
                  className={`w-full h-full object-cover ${shouldBlur(image) ? 'blur-[6px]' : ''}`}
                />
                {shouldBlur(image) && image.image_type === 'PAID' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 px-4 py-2 rounded-lg">
                      <p className="text-white text-sm font-medium">購入後に閲覧可能</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            {images.length < 5 ? (
              <>
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    } ${img.image_type === 'MAIN' ? 'ring-2 ring-white ring-offset-1 ring-offset-black/50' : ''}`}
                  />
                ))}
              </>
            ) : (
              <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
          <button
            onClick={() => scrollTo(currentIndex - 1)}
            className={`absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white ${
              currentIndex === 0 ? 'hidden' : ''
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollTo(currentIndex + 1)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white ${
              currentIndex === images.length - 1 ? 'hidden' : ''
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
};