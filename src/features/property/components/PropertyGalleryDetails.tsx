import React, { useState } from 'react';
import { FilterIcon } from './FilterIcon';
import { PhotoTile } from './PhotoTile';
import { RoomDetails } from '../../room/types/room_types';
import { Image } from '../../image/types/image_types';
import { Product } from '../../product/types/product_types';

interface PropertyGalleryDetailsProps {
  propertyId: string;
  images: Image[];
  rooms: RoomDetails[];
  isPurchased: boolean;
  isOwner: boolean;
}

export const PropertyGalleryDetails: React.FC<PropertyGalleryDetailsProps> = ({
  propertyId,
  images,
  rooms,
  isPurchased,
  isOwner
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // 物件の画像のみをフィルタリング（部屋や製品に紐付いていない画像）
  const propertyImages = images?.filter(img => !img.room_id && !img.product_id) || [];

  // 画像がPAIDで、未購入かつ所有者でない場合にブラー効果を適用
  const shouldBlur = (image: Image) => {
    return image.image_type === 'PAID' && (!isPurchased && !isOwner);
  };

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
    const product = products.find((p: Product) => p.id === img.product_id);
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

  // 全ての画像を結合（物件の画像も含める）
  const allImages = [...propertyImages, ...roomImages, ...productImages];

  // 画像をタイプ別にグループ化
  const normalImages = allImages.filter(img => img.image_type !== 'PAID');
  const paidImages = allImages.filter(img => img.image_type === 'PAID');

  // フバッグ用のログ
  console.log('PropertyGalleryDetails images:', {
    all: images?.map(img => ({
      id: img.id,
      type: img.image_type,
      property_id: img.property_id,
      room_id: img.room_id,
      product_id: img.product_id
    })),
    property: propertyImages.map(img => ({
      id: img.id,
      type: img.image_type
    })),
    filtered: allImages.map(img => ({
      id: img.id,
      type: img.image_type,
      shouldBlur: shouldBlur(img)
    }))
  });

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

  // フィルタリングされた画像をタイプ別に分類
  const filteredNormalImages = filteredImages.filter(img => img.image_type !== 'PAID');
  const filteredPaidImages = filteredImages.filter(img => img.image_type === 'PAID');

  const renderPhotoTile = (image: Image) => {
    const room = rooms?.find(r => r.id === image.room_id);
    const products = room?.products || [];
    const product = products.find((p: Product) => p.id === image.product_id);
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
        shouldBlur={shouldBlur(image)}
      />
    );
  };

  return (
    <>
      {/* フィルターアイコン */}
      <div className="mt-4">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide pl-2">
          <FilterIcon
            image={propertyImages[0] || null}
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

      {/* 通常画像グリッド */}
      <div className="mt-2">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-0.5 bg-gray-100">
          {filteredNormalImages.map(renderPhotoTile)}
        </div>
      </div>

      {/* PAID画像セクション */}
      {filteredPaidImages.length > 0 && (
        <div className="mt-8">
          <div className="py-4 bg-gray-50">
            <p className="text-gray-700 font-medium px-6">
            物件仕様購入後に以下{filteredPaidImages.length}枚の画像が閲覧可能になります
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-0.5 bg-gray-100">
            {filteredPaidImages.map(renderPhotoTile)}
          </div>
        </div>
      )}
    </>
  );
}; 