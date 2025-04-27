import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Image } from '../../image/types/image_types';

type ImageType = 'MAIN' | 'SUB' | 'PAID';

interface PropertyGalleryProps {
  images: Image[];
  propertyName: string;
  isPurchased?: boolean;
  isOwner?: boolean;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ 
  images, 
  propertyName,
  isPurchased = false,
  isOwner = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 画像がPAIDで、未購入かつ所有者でない場合にブラー効果を適用
  const shouldBlur = (image: Image) => {
    const shouldApplyBlur = image.image_type === 'PAID' && (!isPurchased && !isOwner);
    // デバッグ用のログ
    console.log('Blur check:', {
      imageId: image.id,
      imageType: image.image_type,
      isPurchased,
      isOwner,
      shouldBlur: shouldApplyBlur
    });
    return shouldApplyBlur;
  };

  // デバッグ用のログ
  console.log('PropertyGallery props:', { 
    isPurchased, 
    isOwner,
    imagesCount: images.length 
  });

  // 画像を種類ごとにグループ化
  const mainImage = images.find(img => img.image_type === 'MAIN');
  const subImages = images.filter(img => img.image_type === 'SUB');
  const paidImages = images.filter(img => img.image_type === 'PAID');

  // デバッグ用のログ
  console.log('Grouped images:', {
    main: mainImage ? { id: mainImage.id, type: mainImage.image_type } : null,
    sub: subImages.map(img => ({ id: img.id, type: img.image_type })),
    paid: paidImages.map(img => ({ id: img.id, type: img.image_type }))
  });

  // 表示順序を設定：MAIN -> SUB -> PAID
  const displayImages = [
    ...(mainImage ? [mainImage] : []),
    ...subImages,
    ...paidImages
  ];

  // デバッグ用のログ
  console.log('Display images:', displayImages.map(img => ({
    id: img.id,
    type: img.image_type,
    shouldBlur: shouldBlur(img),
    isPurchased,
    isOwner
  })));

  useEffect(() => {
    // 初回のみメイン画像にスクロール
    const mainImageIndex = displayImages.findIndex(img => img.image_type === 'MAIN');
    if (mainImageIndex !== -1) {
      setCurrentIndex(mainImageIndex);
      scrollTo(mainImageIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存配列を空にして初回のみ実行

  if (displayImages.length === 0) return null;

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
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory h-full"
        onScroll={handleScroll}
      >
        <div className="flex h-full">
          {displayImages.map((image, index) => (
            <div key={image.id} className="flex-none w-full snap-start h-full">
              <div className="aspect-square md:aspect-[4/3] relative h-full">
                <img
                  src={image.url}
                  alt={image.description || `${propertyName} - ${image.image_type === 'MAIN' ? 'メイン画像' : `画像 ${index + 1}`}`}
                  className={`w-full h-full object-cover ${shouldBlur(image) ? 'blur-[6px]' : ''}`}
                />
                {shouldBlur(image) && (
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
      {displayImages.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            {displayImages.map((img, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                } ${img.image_type === 'MAIN' ? 'ring-2 ring-white ring-offset-1 ring-offset-black/50' : ''}`}
              />
            ))}
            <span className="ml-2 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
              {currentIndex + 1} / {displayImages.length}
            </span>
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
              currentIndex === displayImages.length - 1 ? 'hidden' : ''
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
};