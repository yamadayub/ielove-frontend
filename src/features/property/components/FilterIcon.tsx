import React from 'react';
import type { Image } from '../../image/types/image_types';

interface FilterIconProps {
  image: Image;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const FilterIcon: React.FC<FilterIconProps> = ({
  image,
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center space-y-1 px-2 pt-2"
    >
      <div className="relative w-16 h-16 p-0.5">
        <div
          className={`absolute inset-0 rounded-full ring-2 ring-offset-2 ${
            isSelected ? "ring-blue-500" : "ring-gray-200"
          }`}
        >
          <img
            src={image.url}
            alt={label}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <span className="text-xs text-gray-700 truncate max-w-[64px]">
        {label}
      </span>
    </button>
  );
}; 