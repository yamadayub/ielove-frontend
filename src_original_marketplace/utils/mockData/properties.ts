// 物件のモックデータ
import { Property } from '../../types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'グランドメゾン青山',
    location: '東京都港区',
    description: '緑豊かな環境と都会の利便性を兼ね備えた邸宅',
    property_type: 'house',
    layout: '3LDK',
    construction_year: 2020,
    construction_month: 4,
    site_area: 120.5,
    building_area: 95.2,
    floor_count: 3,
    structure: 'RC造',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80',
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'パークサイドレジデンス',
    location: '東京都世田谷区',
    description: '都心へのアクセス良好な低層マンション',
    property_type: 'apartment',
    layout: '2LDK',
    construction_year: 2021,
    construction_month: 8,
    site_area: 85.3,
    building_area: 70.2,
    floor_count: 2,
    structure: 'RC造',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    ],
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];