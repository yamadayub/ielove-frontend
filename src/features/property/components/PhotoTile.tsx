import React from 'react';
import { Link } from 'react-router-dom';
import type { Image } from '../../image/types/image_types';

interface PhotoTileProps {
  image: Image;
  propertyId: string;
  name: string;
  link: string;
}

export const PhotoTile: React.FC<PhotoTileProps> = ({
  image,
  propertyId,
  name,
  link,
}) => {
  return (
    <Link to={link} className="relative block aspect-square">
      <img
        src={image.url}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-sm truncate">
            {name}
          </p>
        </div>
      </div>
    </Link>
  );
}; 