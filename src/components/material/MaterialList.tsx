import React from 'react';
import { Link } from 'react-router-dom';
import { Material } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface MaterialListProps {
  propertyId: string;
  roomId: string;
  materials: Material[];
  isPurchased?: boolean;
}

export const MaterialList: React.FC<MaterialListProps> = ({ 
  propertyId, 
  roomId, 
  materials,
  isPurchased = false
}) => {
  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
      {materials.map((material) => (
        <Link
          key={material.id}
          to={`/property/${propertyId}/room/${roomId}/material/${material.id}`}
          className="block relative group"
        >
          <div className="aspect-square relative">
            <img
              src={material.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
              alt={material.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors">
              {/* 仕上げ材名を上部に配置 */}
              <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                <h3 className="text-white text-sm font-medium">{material.type}</h3>
              </div>
              
              {/* 詳細アイコン */}
              <div className="absolute bottom-2 right-2">
                <button className="p-2 bg-white/90 rounded-full shadow-sm">
                  <ArrowUpRight className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              {/* 詳細情報（ブラー処理） */}
              <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent ${!isPurchased ? 'blur-sm' : ''}`}>
                <p className="text-white text-xs">
                  {material.manufacturer} / {material.modelNumber}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};