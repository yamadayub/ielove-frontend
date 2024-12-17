import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property } from '../../types';
import { RoomList } from '../../components/property/RoomList';
import { CreateRoomModal } from '../../components/property/CreateRoomModal';
import { mockApi } from '../../utils/mockApi';
import { ArrowLeft, Plus } from 'lucide-react';

export const EditPropertyPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!propertyId) return;
        const response = await mockApi.getProperty(propertyId);
        setProperty(response.data);
      } catch (error) {
        console.error('Failed to fetch property:', error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b md:hidden">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">{property.name}の編集</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}の編集</h1>
        </div>
      </div>

      {/* 物件情報 */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <dt className="text-sm text-gray-500">所在地</dt>
              <dd className="mt-1 text-sm text-gray-900">{property.location}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">物件タイプ</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {property.property_type === 'house' ? '一戸建て' : 
                 property.property_type === 'apartment' ? 'マンション' : 'その他'}
              </dd>
            </div>
            {property.layout && (
              <div>
                <dt className="text-sm text-gray-500">間取り</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.layout}</dd>
              </div>
            )}
            {property.structure && (
              <div>
                <dt className="text-sm text-gray-500">構造</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.structure}</dd>
              </div>
            )}
            {(property.construction_year || property.construction_month) && (
              <div>
                <dt className="text-sm text-gray-500">築年月</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {property.construction_year}年
                  {property.construction_month && `${property.construction_month}月`}
                </dd>
              </div>
            )}
            {property.site_area && (
              <div>
                <dt className="text-sm text-gray-500">敷地面積</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.site_area}㎡</dd>
              </div>
            )}
            {property.building_area && (
              <div>
                <dt className="text-sm text-gray-500">専有面積</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.building_area}㎡</dd>
              </div>
            )}
            {property.floor_count && (
              <div>
                <dt className="text-sm text-gray-500">階数</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.floor_count}階</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* 部屋一覧 */}
      <div className="bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">部屋一覧</h2>
              <button
                onClick={() => setIsCreateRoomModalOpen(true)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Plus className="h-4 w-4" />
                <span>部屋を追加</span>
              </button>
            </div>
          </div>
          <RoomList propertyId={propertyId!} />
        </div>
      </div>

      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        propertyId={propertyId!}
      />
    </div>
  );
};