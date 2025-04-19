import React from 'react';

interface ProductBasicInfoProps {
  manufacturerName?: string;
  productCode?: string;
  catalogUrl?: string;
  description?: string;
  shouldBlur: boolean;
  blurClass: string;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  manufacturerName,
  productCode,
  catalogUrl,
  description,
  shouldBlur,
  blurClass,
}) => {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* メーカー */}
      <div className={`border-b pb-2 ${blurClass}`}>
        <dt className="text-sm text-gray-600">メーカー</dt>
        <dd className="text-sm font-medium">{manufacturerName || '不明'}</dd>
      </div>

      {/* 製品コード */}
      <div className={`border-b pb-2 ${blurClass}`}>
        <dt className="text-sm text-gray-600">製品コード</dt>
        <dd className="text-sm font-medium">{productCode || '不明'}</dd>
      </div>

      {/* カタログリンク */}
      {catalogUrl && (
        <div className={`pt-2 ${blurClass}`}>
          <a 
            href={shouldBlur ? undefined : catalogUrl}
            onClick={e => shouldBlur && e.preventDefault()}
            className={`text-sm text-blue-600 ${shouldBlur ? 'pointer-events-none' : 'hover:text-blue-800'}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            カタログを見る →
          </a>
        </div>
      )}

      {/* 製品説明 */}
      <div className={`pt-2 ${blurClass}`}>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </div>
  );
}; 