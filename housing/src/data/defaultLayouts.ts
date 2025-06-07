interface FloorElement {
  id: string;
  type: 'wall' | 'door' | 'window' | 'kitchen' | 'bathtub' | 'toilet' | 'refrigerator' | 'washing_machine' | 'desk' | 'chair' | 'shelf';
  x: number; // mm単位の座標
  y: number; // mm単位の座標
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

// 4方を壁に囲まれたワンルームの初期間取りデータ（8m×6m）
export const defaultOneRoomLayout: FloorElement[] = [
  // 外壁（四方）
  // 南側の壁（ドア側）- 横向きの壁
  {
    id: 'wall_south',
    type: 'wall',
    x: 0,
    y: 0,
    dimensions: {
      width: 8000, // 8m横幅
      depth: 120, // 120mm厚（奥行き）
      height: 2400 // 2.4m高さ
    },
    properties: {
      material: 'concrete'
    }
  },
  // 東側の壁（窓側）- 縦向きの壁
  {
    id: 'wall_east',
    type: 'wall',
    x: 7880, // 8000 - 120
    y: 0,
    dimensions: {
      width: 120, // 120mm厚（幅）
      depth: 6000, // 6m縦幅（奥行き）
      height: 2400
    },
    properties: {
      material: 'concrete'
    }
  },
  // 北側の壁（窓側）- 横向きの壁
  {
    id: 'wall_north',
    type: 'wall',
    x: 0,
    y: 5880, // 6000 - 120
    dimensions: {
      width: 8000, // 8m横幅
      depth: 120, // 120mm厚（奥行き）
      height: 2400
    },
    properties: {
      material: 'concrete'
    }
  },
  // 西側の壁（窓側）- 縦向きの壁
  {
    id: 'wall_west',
    type: 'wall',
    x: 0,
    y: 0,
    dimensions: {
      width: 120, // 120mm厚（幅）
      depth: 6000, // 6m縦幅（奥行き）
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
    x: 3550, // 中央配置（(8000 - 900) / 2）
    y: 0,
    dimensions: {
      width: 900, // ドア幅
      depth: 35, // ドア厚み
      height: 2000
    },
    properties: {
      material: 'wood',
      swingDirection: 'inward'
    }
  },

  // 窓（3方向）
  // 東側の窓
  {
    id: 'window_east',
    type: 'window',
    x: 7880,
    y: 2100, // 中央配置（(6000 - 1800) / 2）
    dimensions: {
      width: 40, // 窓の厚み
      depth: 1800, // 窓の高さ（奥行き方向）
      height: 1200
    },
    properties: {
      heightFrom: 800, // 床から800mm
      glassWidth: 10,
      windowType: 'sliding',
      glassType: 'double'
    }
  },
  // 北側の窓
  {
    id: 'window_north',
    type: 'window',
    x: 3100, // 中央配置（(8000 - 1800) / 2）
    y: 5880,
    dimensions: {
      width: 1800, // 窓の幅
      depth: 40, // 窓の厚み
      height: 1200
    },
    properties: {
      heightFrom: 800, // 床から800mm
      glassWidth: 10,
      windowType: 'sliding',
      glassType: 'double'
    }
  },
  // 西側の窓
  {
    id: 'window_west',
    type: 'window',
    x: 0,
    y: 2100, // 中央配置（(6000 - 1800) / 2）
    dimensions: {
      width: 40, // 窓の厚み
      depth: 1800, // 窓の高さ（奥行き方向）
      height: 1200
    },
    properties: {
      heightFrom: 800, // 床から800mm
      glassWidth: 10,
      windowType: 'sliding',
      glassType: 'double'
    }
  }
];

// レイアウトのメタデータ
export const layoutMetadata = {
  '1R_simple': {
    name: '4方壁ワンルーム',
    description: '長方形のワンルーム（8m×6m）、南側にドア1つ、東・北・西側に窓',
    totalArea: 48, // 平米
    buildingType: 'detached_house',
    floorCount: 1,
    elements: defaultOneRoomLayout
  }
};

// デフォルトレイアウトを取得する関数
export const getDefaultLayout = (floorPlan: string, propertyType: string): FloorElement[] => {
  // すべてのパターンで4方壁ワンルームを返す
  return defaultOneRoomLayout;
}; 