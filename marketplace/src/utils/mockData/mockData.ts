import { Property, Room, MaterialSpec, DoorSpec, LightingSpec, RoomSpecifications } from '../types/types';

// Base specifications template
const baseSpecs: RoomSpecifications = {
  flooring: {
    id: 'f1',
    type: '床材',
    name: '無垢材フローリング',
    manufacturer: 'ナチュラルウッド',
    modelNumber: 'NW-OF-123',
    dimensions: '15 x 90 x 1820mm',
    color: 'ナチュラルオーク',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80',
    additionalDetails: {
      '耐久性': '25年保証',
      '施工方法': '接着剤併用フローティング工法'
    }
  },
  walls: {
    id: 'w1',
    type: '壁材',
    name: '珪藻土クロス',
    manufacturer: 'エコウォール',
    modelNumber: 'EW-DC-456',
    dimensions: '92cm x 30m',
    color: 'アイボリーホワイト',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
    additionalDetails: {
      '防火性能': '不燃',
      '調湿機能': 'あり'
    }
  },
  ceiling: {
    id: 'c1',
    type: '天井',
    name: '高機能天井材',
    manufacturer: 'スカイテック',
    modelNumber: 'ST-C-789',
    dimensions: '60cm x 60cm',
    color: 'ピュアホワイト',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    additionalDetails: {
      '防音性能': '遮音等級D-65',
      '断熱性能': 'H-4'
    }
  },
  door: {
    id: 'd1',
    type: 'ドア',
    name: '防音ドア',
    manufacturer: 'セーフティドア',
    modelNumber: 'SD-234',
    dimensions: '750 x 2100mm',
    color: 'ウォールナット',
    price: 180000,
    imageUrl: 'https://images.unsplash.com/photo-1534172553917-0ce2ef189cda?auto=format&fit=crop&w=800&q=80',
    handleType: 'レバーハンドル',
    lockType: '電子錠',
    closerType: 'ソフトクローズ',
    additionalDetails: {
      '防音性能': '遮音等級T-2',
      '耐火性能': '30分耐火'
    }
  },
  lighting: {
    id: 'l1',
    type: '照明',
    name: 'LEDシーリングライト',
    manufacturer: 'ライトマスター',
    modelNumber: 'LM-567',
    dimensions: '580 x 580mm',
    color: 'シルバー',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
    bulbType: 'LED',
    colorTemperature: '2700K-6500K',
    wattage: 85,
    switchType: 'リモコン調光・調色',
    additionalDetails: {
      '調光範囲': '1-100%',
      '専用リモコン': '付属'
    }
  }
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'グランドメゾン青山',
    location: '東京都港区',
    description: '緑豊かな環境と都会の利便性を兼ね備えた邸宅',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'パークサイドレジデンス',
    location: '東京都世田谷区',
    description: '都心へのアクセス良好な低層マンション',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
];

export const MOCK_ROOMS: Room[] = [
  {
    id: 'living1',
    propertyId: '1',
    name: 'リビングダイニング',
    description: '明るく開放的な空間で、ご家族との団らんを楽しめます。',
    area: 25.8,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'kitchen1',
    propertyId: '1',
    name: 'キッチン',
    description: '使いやすく機能的なシステムキッチンを採用。',
    area: 13.2,
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'master1',
    propertyId: '1',
    name: '主寝室',
    description: '落ち着いた雰囲気の広々とした主寝室。',
    area: 14.5,
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'bedroom1',
    propertyId: '1',
    name: '個室1',
    description: '子供部屋や書斎として活用できる居室。',
    area: 10.2,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'bedroom2',
    propertyId: '1',
    name: '個室2',
    description: '収納も充実した居室。',
    area: 10.2,
    images: [
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'entrance1',
    propertyId: '1',
    name: '玄関',
    description: '大型のシューズクローゼットを備えた玄関。',
    area: 4.5,
    images: [
      'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'hallway1',
    propertyId: '1',
    name: '廊下',
    description: '採光と通気性に配慮した廊下。',
    area: 6.8,
    images: [
      'https://images.unsplash.com/photo-1597218868981-1b68e15f0065?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'toilet1',
    propertyId: '1',
    name: 'トイレ',
    description: '清潔感のある落ち着いた空間。',
    area: 2.0,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
  {
    id: 'washroom1',
    propertyId: '1',
    name: '洗面室',
    description: '収納豊富な洗面化粧台を設置。',
    area: 3.8,
    images: [
      'https://images.unsplash.com/photo-1584622781867-1c5fe959485b?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: { ...baseSpecs },
  },
];