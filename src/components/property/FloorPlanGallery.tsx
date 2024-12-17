import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FloorPlanGalleryProps {
  floorPlans: string[];
}

export const FloorPlanGallery: React.FC<FloorPlanGalleryProps> = ({ floorPlans }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (floorPlans.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + floorPlans.length) % floorPlans.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">間取り図</h2>
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={floorPlans[currentIndex]}
            alt={`Floor plan ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
        {floorPlans.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}
        {floorPlans.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {floorPlans.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};