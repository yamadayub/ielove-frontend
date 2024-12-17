// 仕上げ材のモックデータ
import { Material } from '../../types';

export const DEFAULT_MATERIALS: Record<string, Material> = {
  f1: {
    id: 'f1',
    type: '床材',
    name: '無垢材フローリング',
    manufacturer: 'ナチュラルウッド',
    modelNumber: 'NW-OF-123',
    dimensions: '15 x 90 x 1820mm',
    color: 'ナチュラルオーク',
    details: '25年保証付き',
    imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80',
    catalogUrl: 'https://example.com/catalog/flooring',
    additionalDetails: {
      '耐久性': '25年保証',
      '施工方法': '接着剤併用フローティング工法'
    }
  },
  w1: {
    id: 'w1',
    type: '壁紙',
    name: '珪藻土クロス',
    manufacturer: 'エコウォール',
    modelNumber: 'EW-DC-456',
    dimensions: '92cm x 30m',
    color: 'アイボリーホワイト',
    details: '調湿機能付き',
    imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
    catalogUrl: 'https://example.com/catalog/wallpaper',
    additionalDetails: {
      '防火性能': '不燃',
      '調湿機能': 'あり'
    }
  },
  c1: {
    id: 'c1',
    type: '天井',
    name: '高機能天井材',
    manufacturer: 'スカイテック',
    modelNumber: 'ST-C-789',
    dimensions: '60cm x 60cm',
    color: 'ピュアホワイト',
    details: '防音・断熱仕様',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    catalogUrl: 'https://example.com/catalog/ceiling',
    additionalDetails: {
      '防音性能': '遮音等級D-65',
      '断熱性能': 'H-4'
    }
  },
  l1: {
    id: 'l1',
    type: '照明',
    name: 'LEDシーリングライト',
    manufacturer: 'ライトマスター',
    modelNumber: 'LM-567',
    dimensions: '580 x 580mm',
    color: 'シルバー',
    details: 'リモコン調光・調色機能付き',
    imageUrl: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
    catalogUrl: 'https://example.com/catalog/lighting',
    additionalDetails: {
      '調光範囲': '1-100%',
      '専用リモコン': '付属'
    }
  },
  d1: {
    id: 'd1',
    type: 'ドア',
    name: '防音ドア',
    manufacturer: 'セーフティドア',
    modelNumber: 'SD-234',
    dimensions: '750 x 2100mm',
    color: 'ウォールナット',
    details: '遮音性能T-2等級',
    imageUrl: 'https://images.unsplash.com/photo-1534172553917-0ce2ef189cda?auto=format&fit=crop&w=800&q=80',
    catalogUrl: 'https://example.com/catalog/door',
    additionalDetails: {
      '防音性能': '遮音等級T-2',
      '耐火性能': '30分耐火'
    }
  }
};