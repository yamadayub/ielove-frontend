interface FloorElement {
  id: string;
  type: 'wall' | 'door' | 'window' | 'kitchen' | 'bathtub' | 'toilet' | 'refrigerator' | 'washing_machine' | 'desk' | 'chair' | 'shelf';
  x: number; // mm単位の座標
  y: number; // mm単位の座標
  rotation: number;
  dimensions: {
    width: number;   // x方向 (平面図での幅) mm
    depth: number;   // y方向 (平面図での奥行き) mm  
    height: number;  // z方向 (実際の高さ) mm
  };
  properties: {
    material?: string;
    heightFrom?: number; // 床からの高さ (mm)
    heightTo?: number;   // 上端の高さ (mm)
    swingDirection?: 'left' | 'right' | 'inward' | 'outward';
    glassWidth?: number;
    windowType?: 'sliding' | 'casement' | 'fixed';
    glassType?: 'single' | 'double' | 'triple' | 'low-e';
    [key: string]: any;
  };
}

// シンプルなワンルームの初期間取りデータ（10m×10m正方形）
export const defaultOneRoomLayout: FloorElement[] = [
  // 外壁（四方）
  // 南側の壁（ドア側）
  {
    id: 'wall_south',
    type: 'wall',
    x: 0,
    y: 0,
    rotation: 0,
    dimensions: {
      width: 10000, // 10m
      depth: 100, // 100mm厚
      height: 2400 // 2.4m
    },
    properties: {
      material: 'concrete'
    }
  },
  // 東側の壁（掃き出し窓側）
  {
    id: 'wall_east',
    type: 'wall',
    x: 9900, // 10000 - 100
    y: 0,
    rotation: 90,
    dimensions: {
      width: 10000, // 10m
      depth: 100,
      height: 2400
    },
    properties: {
      material: 'concrete'
    }
  },
  // 北側の壁（掃き出し窓側）
  {
    id: 'wall_north',
    type: 'wall',
    x: 0,
    y: 9900, // 10000 - 100
    rotation: 0,
    dimensions: {
      width: 10000,
      depth: 100,
      height: 2400
    },
    properties: {
      material: 'concrete'
    }
  },
  // 西側の壁（掃き出し窓側）
  {
    id: 'wall_west',
    type: 'wall',
    x: 0,
    y: 0,
    rotation: 90,
    dimensions: {
      width: 10000,
      depth: 100,
      height: 2400
    },
    properties: {
      material: 'concrete'
    }
  },

  // ドア（南側の壁中央）
  {
    id: 'door_entrance',
    type: 'door',
    x: 4550, // 中央配置（(10000 - 900) / 2）
    y: 0,
    rotation: 0,
    dimensions: {
      width: 900,
      depth: 35,
      height: 2000
    },
    properties: {
      material: 'wood',
      swingDirection: 'inward'
    }
  },

  // 掃き出し窓（3方向）
  // 東側の掃き出し窓
  {
    id: 'window_east',
    type: 'window',
    x: 9900,
    y: 4100, // 中央配置（(10000 - 1800) / 2）
    rotation: 90,
    dimensions: {
      width: 1800,
      depth: 35,
      height: 2000
    },
    properties: {
      heightFrom: 0, // 床から
      glassWidth: 10,
      windowType: 'sliding',
      glassType: 'double'
    }
  },
  // 北側の掃き出し窓
  {
    id: 'window_north',
    type: 'window',
    x: 4100, // 中央配置（(10000 - 1800) / 2）
    y: 9900,
    rotation: 0,
    dimensions: {
      width: 1800,
      depth: 35,
      height: 2000
    },
    properties: {
      heightFrom: 0, // 床から
      glassWidth: 10,
      windowType: 'sliding',
      glassType: 'double'
    }
  },
  // 西側の掃き出し窓
  {
    id: 'window_west',
    type: 'window',
    x: 0,
    y: 4100, // 中央配置（(10000 - 1800) / 2）
    rotation: 90,
    dimensions: {
      width: 1800,
      depth: 35,
      height: 2000
    },
    properties: {
      heightFrom: 0, // 床から
      glassWidth: 10,
      windowType: 'sliding',
      glassType: 'double'
    }
  }
];

// レイアウトのメタデータ
export const layoutMetadata = {
  '1R_simple': {
    name: 'シンプルワンルーム',
    description: '正方形のワンルーム（10m×10m）、片開きドア1つ、引き違い掃き出し窓3つ',
    totalArea: 100, // 平米
    buildingType: 'detached_house',
    floorCount: 1,
    elements: defaultOneRoomLayout
  }
};

// デフォルトレイアウトを取得する関数
export const getDefaultLayout = (floorPlan: string, propertyType: string): FloorElement[] => {
  // すべてのパターンでシンプルなワンルームを返す
  return defaultOneRoomLayout;
}; 