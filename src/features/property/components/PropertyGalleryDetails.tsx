import React, { useState } from 'react';
import { FilterIcon } from './FilterIcon';
import { PhotoTile } from './PhotoTile';
import { Room } from '../../room/types/room_types';
import { Image } from '../../image/types/image_types';

interface PropertyGalleryDetailsProps {
  propertyId: string;
  images: Image[];
  rooms: Room[];
}

export const PropertyGalleryDetails: React.FC<PropertyGalleryDetailsProps> = ({
  propertyId,
  images,
  rooms,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // 物件の画像のみをフィルタリング
  const propertyImages = images?.filter(img => !img.room_id && !img.product_id) || [];

  // メイン画像を持つ部屋と製品を抽出
  const roomMainImages = images?.filter(img => 
    img.room_id && !img.product_id && img.image_type === 'MAIN'
  ).map(img => {
    const room = rooms?.find(r => r.id === img.room_id);
    return {
      ...img,
      roomName: room?.name || `部屋 ${img.room_id}`
    };
  }) || [];

  const productMainImages = images?.filter(img => 
    img.product_id && img.image_type === 'MAIN'
  ).map(img => {
    const room = rooms?.find(r => r.id === img.room_id);
    const products = room?.products || [];
    const product = products.find(p => p.id === img.product_id);
    return {
      ...img,
      productName: product?.name || `製品 ${img.product_id}`
    };
  }) || [];

  // 部屋と製品の全画像をフィルタリング
  const roomImages = images?.filter(img => 
    img.room_id && !img.product_id
  ) || [];

  const productImages = images?.filter(img => 
    img.product_id
  ) || [];

  // 全ての画像を結合（物件のメイン画像は除外）
  const allImages = [...roomImages, ...productImages];

  // フィルタリングされた画像
  const filteredImages = selectedFilter 
    ? allImages.filter(img => {
        if (selectedFilter.startsWith('room_')) {
          const roomId = Number(selectedFilter.replace('room_', ''));
          return img.room_id === roomId;
        } else if (selectedFilter.startsWith('product_')) {
          const productId = Number(selectedFilter.replace('product_', ''));
          return img.product_id === productId;
        }
        return false;
      })
    : allImages;

  return (
    <>
      {/* フィルターアイコン */}
      <div className="mt-4 px-4">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          <FilterIcon
            image={propertyImages[0]}
            label="全て"
            isSelected={selectedFilter === null}
            onClick={() => setSelectedFilter(null)}
          />
          {roomMainImages.map((image) => (
            <FilterIcon
              key={`room_${image.room_id}`}
              image={image}
              label={image.roomName}
              isSelected={selectedFilter === `room_${image.room_id}`}
              onClick={() => setSelectedFilter(`room_${image.room_id}`)}
            />
          ))}
          {productMainImages.map((image) => (
            <FilterIcon
              key={`product_${image.product_id}`}
              image={image}
              label={image.productName}
              isSelected={selectedFilter === `product_${image.product_id}`}
              onClick={() => setSelectedFilter(`product_${image.product_id}`)}
            />
          ))}
        </div>
      </div>

      {/* 画像グリッド */}
      <div className="mt-2 -mx-4 md:mx-0">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-0.5 bg-gray-100">
          {filteredImages.map((image) => {
            const room = rooms?.find(r => r.id === image.room_id);
            const products = room?.products || [];
            const product = products.find(p => p.id === image.product_id);
            const name = product?.name || room?.name || '';

            return (
              <PhotoTile
                key={image.id}
                image={image}
                propertyId={propertyId}
                name={name}
                link={image.product_id 
                  ? `/property/${propertyId}/room/${image.room_id}/product/${image.product_id}`
                  : `/property/${propertyId}/room/${image.room_id}`
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}; 