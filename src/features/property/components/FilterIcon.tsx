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
      className="flex flex-col items-center space-y-1"
    >
      <div
        className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
          isSelected ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <img
          src={image.url}
          alt={label}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs text-gray-700 truncate max-w-[64px]">
        {label}
      </span>
    </button>
  );
}; 