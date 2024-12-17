import React from 'react';
import { Material } from '../../types';
import { Edit } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  onEdit: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit }) => {
  return (
    <div className="relative group">
      <div className="aspect-square">
        <img
          src={material.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
          alt={material.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors">
          {/* 編集ボタン */}
          <div className="absolute top-2 right-2">
            <button 
              onClick={onEdit}
              className="p-2 bg-white/90 rounded-full shadow-sm"
            >
              <Edit className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          {/* 材料名を中央に配置 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="font-medium text-white text-sm md:text-lg text-center px-2">
              {material.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};