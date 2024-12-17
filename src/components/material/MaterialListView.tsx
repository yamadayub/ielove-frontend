import React from 'react';
import { Link } from 'react-router-dom';
import { Material } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface MaterialListViewProps {
  propertyId: string;
  roomId: string;
  materials: Material[];
  isPurchased?: boolean;
}

export const MaterialListView: React.FC<MaterialListViewProps> = ({ 
  propertyId, 
  roomId, 
  materials,
  isPurchased = false
}) => {
  return (
    <div className="divide-y divide-gray-100 -mx-4 bg-white">
      {materials.map((material) => (
        <Link
          key={material.id}
          to={`/property/${propertyId}/room/${roomId}/material/${material.id}`}
          className="block hover:bg-gray-50/80 transition-colors"
        >
          <div className="flex items-center">
            {/* 画像部分 */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={material.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
                alt={material.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* コンテンツ部分 */}
            <div className="flex-1 min-w-0 pl-4 pr-3 py-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {material.type}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 truncate">
                    {material.name}
                  </p>
                  <div className={!isPurchased ? 'blur-sm' : ''}>
                    <p className="mt-1 text-xs text-gray-500">
                      メーカー: {material.manufacturer}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      型番: {material.modelNumber}
                    </p>
                  </div>
                </div>

                {/* アイコン部分 */}
                <div className="ml-4">
                  <div className="p-1.5 bg-gray-100 rounded-full">
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};