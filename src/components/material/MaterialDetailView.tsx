import React from 'react';
import { Material } from '../../types';
import { ExternalLink } from 'lucide-react';

interface MaterialDetailViewProps {
  material: Material;
  isPurchased: boolean;
}

export const MaterialDetailView: React.FC<MaterialDetailViewProps> = ({
  material,
  isPurchased
}) => {
  return (
    <div className="md:max-w-2xl md:mx-auto md:bg-white md:rounded-lg md:shadow-sm md:my-8">
      {/* 画像セクション */}
      <div className="aspect-square md:aspect-video w-full">
        <img
          src={material.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
          alt={material.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 詳細情報セクション */}
      <div className="p-4 space-y-6">
        {/* 基本情報 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{material.name}</h2>
          <p className="mt-1 text-sm text-gray-500">{material.type}</p>
        </div>

        {/* 仕様情報 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">メーカー</h3>
            <p className={`mt-1 text-sm text-gray-600 ${!isPurchased ? 'blur-sm' : ''}`}>
              {material.manufacturer}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">型番</h3>
            <p className={`mt-1 text-sm text-gray-600 ${!isPurchased ? 'blur-sm' : ''}`}>
              {material.modelNumber}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">色</h3>
            <p className={`mt-1 text-sm text-gray-600 ${!isPurchased ? 'blur-sm' : ''}`}>
              {material.color}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">寸法</h3>
            <p className={`mt-1 text-sm text-gray-600 ${!isPurchased ? 'blur-sm' : ''}`}>
              {material.dimensions}
            </p>
          </div>

          {material.catalogUrl && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">カタログ</h3>
              <a
                href={material.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-500 ${!isPurchased ? 'blur-sm pointer-events-none' : ''}`}
              >
                <span>カタログを見る</span>
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          )}

          {material.details && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">詳細情報</h3>
              <p className={`mt-1 text-sm text-gray-600 whitespace-pre-wrap ${!isPurchased ? 'blur-sm' : ''}`}>
                {material.details}
              </p>
            </div>
          )}

          {material.additionalDetails && Object.entries(material.additionalDetails).map(([key, value]) => (
            <div key={key}>
              <h3 className="text-sm font-medium text-gray-900">{key}</h3>
              <p className={`mt-1 text-sm text-gray-600 ${!isPurchased ? 'blur-sm' : ''}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {!isPurchased && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              詳細情報は物件仕様を購入後に表示されます
            </p>
          </div>
        )}
      </div>
    </div>
  );
};