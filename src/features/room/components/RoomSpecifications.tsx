import React, { useState, useRef } from 'react';
import { Room } from '../../types';
import { useStore } from '../../store/useStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RoomSpecificationsProps {
  room: Room;
}

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
            <div key={index} className="flex-none w-full snap-start">
              <div className="aspect-square">
                <img
                  src={image}
                  alt={`Material image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
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

export const RoomSpecifications: React.FC<RoomSpecificationsProps> = ({ room }) => {
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(room.propertyId));

  const renderSpecification = (label: string, spec: any, key?: string) => {
    if (!spec) return null;

    // 複数の画像を配列として用意（実際のデータに合わせて調整が必要）
    const images = [spec.imageUrl];
    if (spec.additionalImages) {
      images.push(...spec.additionalImages);
    }

    return (
      <div key={key || spec.id} className="border-b border-gray-100 last:border-b-0">
        <ImageGallery images={images} />
        <div className="p-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{label}</h3>
          <div className={`space-y-2 ${!isPropertyPurchased ? 'blur-sm' : ''}`}>
            <p className="text-sm text-gray-600">
              メーカー: <span className="font-medium">{spec.manufacturer}</span>
            </p>
            <p className="text-sm text-gray-600">
              型番: <span className="font-medium">{spec.modelNumber}</span>
            </p>
            <p className="text-sm text-gray-600">
              色: <span className="font-medium">{spec.color}</span>
            </p>
            <p className="text-sm text-gray-600">
              寸法: <span className="font-medium">{spec.dimensions}</span>
            </p>
            {spec.additionalDetails && Object.entries(spec.additionalDetails).map(([key, value]) => (
              <p key={key} className="text-sm text-gray-600">
                {key}: <span className="font-medium">{value as string}</span>
              </p>
            ))}
          </div>
          {!isPropertyPurchased && (
            <p className="text-xs text-gray-500 italic mt-2">
              ※ 詳細情報は購入後に表示されます
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 -mx-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 px-4 mb-4">仕様詳細</h2>
      <div className="space-y-0">
        {renderSpecification('床', room.specifications.flooring)}
        {renderSpecification('壁面', room.specifications.walls)}
        {renderSpecification('天井', room.specifications.ceiling)}
        {renderSpecification('ドア', room.specifications.door)}
        {renderSpecification('照明', room.specifications.lighting)}
      </div>
      {room.specifications.kitchen && (
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 px-4 my-4">キッチン設備</h2>
          <div className="space-y-0">
            {renderSpecification('キャビネット', room.specifications.kitchen.cabinet)}
            {renderSpecification('カウンタートップ', room.specifications.kitchen.countertop)}
          </div>
        </div>
      )}
      {room.specifications.furniture && (
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 px-4 my-4">家具</h2>
          <div className="space-y-0">
            {room.specifications.furniture.map((furniture) => 
              renderSpecification(furniture.name, furniture, furniture.id)
            )}
          </div>
        </div>
      )}
    </div>
  );
};