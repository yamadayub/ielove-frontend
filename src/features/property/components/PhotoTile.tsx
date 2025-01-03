import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '../../image/types/image_types';

interface PhotoTileProps {
  image: Image;
  propertyId: string | number;
  name: string;
  link: string;
}

export const PhotoTile: React.FC<PhotoTileProps> = ({ image, name, link }) => {
  return (
    <Link to={link} className="block relative aspect-square">
      <img
        src={image.url}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="font-medium text-white text-sm md:text-base text-center px-2">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}; 