import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { Grid, Text } from '@react-three/drei';
import { RotateCcw, Grid3X3, Box, X, ZoomIn, ZoomOut, ArrowLeft, Eye, EyeOff, Orbit, Grid2X2 } from 'lucide-react';
import * as THREE from 'three';

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
    frameType?: 'aluminum' | 'wood' | 'vinyl' | 'composite';
    hasStove?: boolean;
    hasSink?: boolean;
    capacity?: number;
    shelves?: number;
    hasDrawers?: boolean;
    hasArmrest?: boolean;
    [key: string]: any;
  };
}

interface PropertyInfo {
  propertyType: 'detached_house' | 'apartment_renovation';
  projectName: string;
  floorPlan: string;
  floorType: string;
  floorArea: string;
  timeline: string;
  description: string;
  specialFeatures?: string[];
}

interface Floor {
  id: string;
  name: string;
  elements: FloorElement[];
}

// 表示制御の状態インターフェース
interface VisibilityState {
  walls: boolean;
  doors: boolean;
  windows: boolean;
  floor: boolean;
  ceiling: boolean;
}

// フローリングテクスチャを生成する関数
const createFlooringTexture = (): THREE.CanvasTexture => {
  // プロシージャルなフローリングパターンを作成
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d')!;
  
  // フローリングのベース色
  const baseColor = '#d2b48c';
  const grainColor = '#8b7355';
  const darkGrain = '#654321';
  
  // 背景を塗りつぶし
  context.fillStyle = baseColor;
  context.fillRect(0, 0, 512, 512);
  
  // 木目パターンを描画
  for (let i = 0; i < 20; i++) {
    const y = (i * 25) + Math.random() * 10;
    context.strokeStyle = i % 2 === 0 ? grainColor : darkGrain;
    context.lineWidth = 1 + Math.random() * 2;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(512, y + Math.random() * 5);
    context.stroke();
  }
  
  // 木目の縦線
  for (let i = 0; i < 8; i++) {
    context.strokeStyle = grainColor;
    context.lineWidth = 0.5;
    context.beginPath();
    context.moveTo(i * 64 + Math.random() * 20, 0);
    context.lineTo(i * 64 + Math.random() * 20, 512);
    context.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8); // テクスチャを繰り返し
  
  return texture;
};

// 壁紙テクスチャを生成する関数
const createWallpaperTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d')!;
  
  // ベース色（オフホワイト）
  const baseColor = '#fafafa';
  const patternColor = '#f0f0f0';
  const subtlePattern = '#e8e8e8';
  
  // 背景を塗りつぶし
  context.fillStyle = baseColor;
  context.fillRect(0, 0, 256, 256);
  
  // 微細な模様パターン
  for (let i = 0; i < 256; i += 8) {
    for (let j = 0; j < 256; j += 8) {
      if ((i + j) % 16 === 0) {
        context.fillStyle = patternColor;
        context.fillRect(i, j, 4, 4);
      }
    }
  }
  
  // 微細なノイズを追加
  for (let i = 0; i < 200; i++) {
    context.fillStyle = subtlePattern;
    context.fillRect(
      Math.random() * 256,
      Math.random() * 256,
      1,
      1
    );
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  
  return texture;
};

// 木目テクスチャを生成する関数（ドア用）
const createWoodTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d')!;
  
  // 木目のベース色
  const baseColor = '#8b4513';
  const lightGrain = '#a0522d';
  const darkGrain = '#654321';
  const veryDarkGrain = '#3e2723';
  
  // 背景を塗りつぶし
  context.fillStyle = baseColor;
  context.fillRect(0, 0, 512, 512);
  
  // 木目の年輪パターン
  for (let i = 0; i < 30; i++) {
    const y = (i * 17) + Math.random() * 8;
    const colors = [lightGrain, darkGrain, veryDarkGrain];
    context.strokeStyle = colors[i % 3];
    context.lineWidth = 0.5 + Math.random() * 2;
    context.beginPath();
    context.moveTo(0, y);
    
    // 波状の木目ライン
    for (let x = 0; x <= 512; x += 10) {
      const waveY = y + Math.sin(x * 0.02) * 3 + Math.random() * 2;
      context.lineTo(x, waveY);
    }
    context.stroke();
  }
  
  // 木目の縦方向のライン
  for (let i = 0; i < 15; i++) {
    const x = (i * 34) + Math.random() * 10;
    context.strokeStyle = darkGrain;
    context.lineWidth = 0.5;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + Math.random() * 5, 512);
    context.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 3);
  
  return texture;
};

// ガラステクスチャを生成する関数（窓用）
const createGlassTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d')!;
  
  // ガラスのベース色（薄い水色）
  const baseColor = '#e0f2fe';
  
  // 背景を塗りつぶし
  context.fillStyle = baseColor;
  context.fillRect(0, 0, 256, 256);
  
  // ガラスの微細な反射パターン
  context.globalAlpha = 0.1;
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const size = Math.random() * 20 + 5;
    
    const gradient = context.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, 'transparent');
    
    context.fillStyle = gradient;
    context.fillRect(x - size, y - size, size * 2, size * 2);
  }
  
  // 微細な縦線（ガラスの筋）
  context.globalAlpha = 0.05;
  for (let i = 0; i < 20; i++) {
    const x = i * 12 + Math.random() * 5;
    context.strokeStyle = '#b3d9f2';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + Math.random() * 3, 256);
    context.stroke();
  }
  
  context.globalAlpha = 1;
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  
  return texture;
};

// カメラコントローラーコンポーネント
const CameraController: React.FC<{ zoom: number }> = ({ zoom }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (camera) {
      console.log(`Updating camera zoom to: ${zoom}`);
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }
  }, [camera, zoom]);
  
  return null;
};

// 壁コンポーネント
const Wall: React.FC<{ 
  element: FloorElement; 
  isSelected: boolean; 
  onSelect: (element: FloorElement) => void;
}> = ({ element, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [wallTexture] = useState(() => createWallpaperTexture());
  
  // 新しいdimensionsベースのデータ構造から寸法を取得（mm単位）
  const wallWidth = element.dimensions.width / 1000; // mmをmに変換
  const wallDepth = element.dimensions.depth / 1000; // mmをmに変換  
  const wallHeight = element.dimensions.height / 1000; // mmをmに変換
  
  // 座標変換：平面図の左上原点からアイソメ図の中央原点へ
  // 8m×6mの部屋の中央を原点(0,0,0)とする
  const x = (element.x + element.dimensions.width / 2 - 4000) / 1000; // 4m(部屋の幅の半分)をオフセット
  const y = wallHeight / 2; // 床から壁の高さの半分の位置
  const z = (element.y + element.dimensions.depth / 2 - 3000) / 1000; // 3m(部屋の奥行きの半分)をオフセット

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      onClick={() => onSelect(element)}
    >
      <boxGeometry args={[wallWidth, wallHeight, wallDepth]} />
      <meshBasicMaterial 
        map={isSelected ? undefined : wallTexture}
        color={isSelected ? "#3b82f6" : "#ffffff"} 
        transparent={false}
        opacity={1}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth)]} />
          <lineBasicMaterial color="#1d4ed8" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};

// ドアコンポーネント
const Door: React.FC<{ 
  element: FloorElement; 
  isSelected: boolean; 
  onSelect: (element: FloorElement) => void;
}> = ({ element, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [woodTexture] = useState(() => createWoodTexture());
  
  // 新しいdimensionsベースのデータ構造から寸法を取得（mm単位）
  const doorWidth = element.dimensions.width / 1000; // mmをmに変換
  const doorDepth = element.dimensions.depth / 1000; // mmをmに変換  
  const doorHeight = element.dimensions.height / 1000; // mmをmに変換
  
  // 座標変換：平面図の左上原点からアイソメ図の中央原点へ
  const x = (element.x + element.dimensions.width / 2 - 4000) / 1000;
  const y = doorHeight / 2; // 床からドアの高さの半分の位置
  const z = (element.y + element.dimensions.depth / 2 - 3000) / 1000;

  return (
    <group>
      {/* ドア枠 */}
      <mesh
        position={[x, y, z]}
        onClick={() => onSelect(element)}
      >
        <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
        <meshBasicMaterial 
          map={isSelected ? undefined : woodTexture}
          color={isSelected ? "#d97706" : "#ffffff"} 
          transparent={false}
          opacity={1}
        />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth)]} />
            <lineBasicMaterial color="#d97706" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* ドアハンドル */}
      <mesh
        position={[x + doorWidth * 0.3, y - doorHeight * 0.1, z]}
      >
        <sphereGeometry args={[0.02]} />
        <meshBasicMaterial color="#c4a484" />
      </mesh>
    </group>
  );
};

// 窓コンポーネント
const Window: React.FC<{ 
  element: FloorElement; 
  isSelected: boolean; 
  onSelect: (element: FloorElement) => void;
}> = ({ element, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [glassTexture] = useState(() => createGlassTexture());
  
  // 新しいdimensionsベースのデータ構造から寸法を取得（mm単位）
  const windowWidth = element.dimensions.width / 1000; // mmをmに変換
  const windowDepth = element.dimensions.depth / 1000; // mmをmに変換  
  const windowHeight = element.dimensions.height / 1000; // mmをmに変換
  const windowFromFloor = (element.properties.heightFrom || 0) / 1000; // 床からの高さ
  
  // 座標変換：平面図の左上原点からアイソメ図の中央原点へ
  const x = (element.x + element.dimensions.width / 2 - 4000) / 1000;
  const y = windowFromFloor + windowHeight / 2; // 床からの高さ + 窓の高さの半分
  const z = (element.y + element.dimensions.depth / 2 - 3000) / 1000;

  return (
    <group>
      {/* 窓枠 */}
      <mesh
        position={[x, y, z]}
        onClick={() => onSelect(element)}
      >
        <boxGeometry args={[windowWidth, windowHeight, windowDepth]} />
        <meshBasicMaterial 
          map={isSelected ? undefined : glassTexture}
          color={isSelected ? "#0ea5e9" : "#ffffff"} 
          transparent 
          opacity={isSelected ? 0.7 : 0.4} 
        />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth)]} />
            <lineBasicMaterial color="#0284c7" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* 窓枠の境界線 */}
      <mesh
        position={[x, y - windowHeight / 2 + 0.01, z]}
      >
        <boxGeometry args={[windowWidth, 0.02, windowDepth]} />
        <meshBasicMaterial color="#6b7280" />
      </mesh>
      <mesh
        position={[x, y + windowHeight / 2 - 0.01, z]}
      >
        <boxGeometry args={[windowWidth, 0.02, windowDepth]} />
        <meshBasicMaterial color="#6b7280" />
      </mesh>
    </group>
  );
};

// 床コンポーネント
const Floor: React.FC<{ visible: boolean }> = ({ visible }) => {
  const floorSize = 10; // 10m×10mの正方形
  const [texture] = useState(() => createFlooringTexture());
  
  if (!visible) return null;
  
  return (
    <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[floorSize, floorSize]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

// 天井コンポーネント
const Ceiling: React.FC<{ visible: boolean }> = ({ visible }) => {
  const ceilingSize = 10; // 10m×10mの正方形
  const ceilingHeight = 2.4; // 2.4mの高さ
  
  if (!visible) return null;
  
  return (
    <mesh position={[0, ceilingHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[ceilingSize, ceilingSize]} />
      <meshBasicMaterial color="#fafafa" side={2} />
    </mesh>
  );
};

// アイソメトリック3Dシーンコンポーネント
const IsometricScene: React.FC<{ 
  floors: Floor[]; 
  propertyInfo: PropertyInfo; 
  showGrid: boolean;
  selectedElement: FloorElement | null;
  onElementSelect: (element: FloorElement) => void;
  onBackgroundClick: () => void;
  zoom: number;
  visibility: VisibilityState;
}> = ({ floors, propertyInfo, showGrid, selectedElement, onElementSelect, onBackgroundClick, zoom, visibility }) => {
  
  const handleBackgroundClick = () => {
    onBackgroundClick();
  };

  return (
    <>
      {/* カメラコントローラー */}
      <CameraController zoom={zoom} />
      
      {/* 環境光 */}
      <ambientLight intensity={0.6} />
      {/* 直接光 */}
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, 10, -5]} intensity={0.4} />
      
      {/* 床 */}
      <Floor visible={visibility.floor} />
      
      {/* 天井 */}
      <Ceiling visible={visibility.ceiling} />
      
      {/* グリッド */}
      {showGrid && (
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#d1d5db" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#9ca3af" 
          fadeDistance={30} 
          fadeStrength={1} 
          followCamera={false} 
          infiniteGrid={true}
        />
      )}
      
      {/* 床の要素を描画 */}
      {floors.map((floor) =>
        floor.elements.map((element) => {
          const isSelected = selectedElement?.id === element.id;
          
          if (element.type === 'wall' && visibility.walls) {
            return <Wall key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          } else if (element.type === 'door' && visibility.doors) {
            return <Door key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          } else if (element.type === 'window' && visibility.windows) {
            return <Window key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          }
          return null;
        })
      )}
      
      {/* 背景クリック検出 */}
      <mesh
        position={[0, 0, 0]}
        onClick={handleBackgroundClick}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>
    </>
  );
};

const IsometricView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const floors: Floor[] = location.state?.floors || [];
  const propertyInfo: PropertyInfo = location.state?.propertyInfo || {
    propertyType: 'detached_house',
    projectName: '',
    floorPlan: '',
    floorType: '',
    floorArea: '50',
    timeline: '',
    description: '',
    specialFeatures: []
  };

  const [showGrid, setShowGrid] = useState(true);
  const [selectedElement, setSelectedElement] = useState<FloorElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(100); // デフォルトズーム値を調整（要素全体が見える）
  
  // 表示制御の状態
  const [visibility, setVisibility] = useState<VisibilityState>({
    walls: true,
    doors: true,
    windows: true,
    floor: true,
    ceiling: false,
  });

  // 表示制御の切り替え
  const toggleVisibility = (key: keyof VisibilityState) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Canvas サイズの動的更新
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    const timer = setTimeout(updateCanvasSize, 100);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      clearTimeout(timer);
    };
  }, []);

  // 要素選択処理
  const handleElementSelect = (element: FloorElement) => {
    console.log('Element selected:', element);
    setSelectedElement(element);
  };

  // 背景クリック処理（選択解除）
  const handleBackgroundClick = () => {
    console.log('Background clicked, deselecting element');
    setSelectedElement(null);
  };

  // ズーム機能
  const handleZoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev * 1.2, 300);
      console.log(`Zoom In: ${prev} -> ${newZoom}`);
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev / 1.2, 10); // 最小値を10に変更
      console.log(`Zoom Out: ${prev} -> ${newZoom}`);
      return newZoom;
    });
  };

  const handleZoomReset = () => {
    console.log('Zoom Reset to 100');
    setZoom(100); // デフォルト値にリセット
  };

  // ホイールズーム
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;
    
    setZoom(prev => {
      let newZoom;
      if (delta > 0) {
        // ズームアウト
        newZoom = Math.max(prev / 1.1, 10); // 最小値を10に変更
      } else {
        // ズームイン
        newZoom = Math.min(prev * 1.1, 300);
      }
      console.log(`Wheel Zoom: ${prev} -> ${newZoom}`);
      return newZoom;
    });
  };

  // ホイールイベントの設定
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  // カメラリセット（アイソメトリック角度に戻す）
  const resetCamera = () => {
    setZoom(100);
    console.log('ズームをリセットしました');
  };

  // 前の画面に戻る
  const handleGoBack = () => {
    navigate(-1);
  };

  // 平面図に移動
  const handleGoToFloorPlan = () => {
    navigate('/floor-plan-editor', {
      state: {
        propertyInfo,
        elements: floors[0]?.elements || []
      }
    });
  };

  // 3Dビューに移動
  const handleGoTo3D = () => {
    navigate('/3d-view', {
      state: {
        floors,
        propertyInfo
      }
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 144px)', maxHeight: 'calc(100vh - 144px)' }}>
      {/* サブヘッダー - ツールバー（固定） */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 z-30 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* ビュー切り替えボタン */}
            <button
              onClick={handleGoToFloorPlan}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
              title="平面図に移動"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={handleGoTo3D}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
              title="3Dビューに移動"
            >
              <Orbit className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            {/* ツールボタン */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="グリッド表示切替"
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            
            {/* ズームコントロール */}
            <div className="bg-gray-100 rounded-lg p-1 flex items-center space-x-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 bg-white hover:bg-gray-50 rounded text-gray-600 hover:text-gray-900 transition-colors"
                title="ズームアウト"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleZoomReset}
                className="px-2 py-1.5 bg-white hover:bg-gray-50 rounded text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors min-w-[60px]"
                title="ズームリセット"
              >
                {Math.round((zoom / 100) * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 bg-white hover:bg-gray-50 rounded text-gray-600 hover:text-gray-900 transition-colors"
                title="ズームイン"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={resetCamera}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="ビューリセット"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* メインアイソメトリックビューエリア（制限された高さ） */}
      <div className="flex-1 relative overflow-hidden" style={{ 
        minHeight: '300px',
        maxHeight: 'calc(100vh - 264px)'
      }}>
        <div 
          ref={containerRef}
          className="w-full h-full"
        >
          <Canvas
            camera={{
              position: [8.66, 8.66, 8.66], // アイソメトリック角度 (30°, 30°, 30°)
              near: 0.1,
              far: 1000,
              zoom: 1 // 初期値は1にして、CameraControllerで制御
            }}
            orthographic
            style={{ 
              background: '#f9fafb',
              width: canvasSize.width,
              height: canvasSize.height
            }}
            dpr={[1, 2]}
            resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
          >
            <IsometricScene 
              floors={floors}
              propertyInfo={propertyInfo}
              showGrid={showGrid}
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
              onBackgroundClick={handleBackgroundClick}
              zoom={zoom}
              visibility={visibility}
            />
          </Canvas>
        </div>

        {/* 要素選択パネル（オーバーレイ） */}
        {selectedElement && (
          <div 
            className="absolute bottom-16 left-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl z-20 max-h-32 overflow-y-auto"
            style={{ 
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Box className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {selectedElement.type === 'wall' ? '壁' : 
                       selectedElement.type === 'door' ? 'ドア' : 
                       selectedElement.type === 'window' ? '窓' : selectedElement.type}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {Math.round(selectedElement.dimensions.width)}mm × {Math.round(selectedElement.dimensions.depth)}mm × {Math.round(selectedElement.dimensions.height)}mm
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedElement(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="選択解除"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* 要素の詳細プロパティ */}
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">材質:</span>
                  <span className="ml-1 text-gray-900">{selectedElement.properties.material || '未設定'}</span>
                </div>
                {selectedElement.type === 'window' && selectedElement.properties.heightFrom && (
                  <div>
                    <span className="text-gray-500">床からの高さ:</span>
                    <span className="ml-1 text-gray-900">{selectedElement.properties.heightFrom}mm</span>
                  </div>
                )}
                {selectedElement.type === 'door' && selectedElement.properties.swingDirection && (
                  <div>
                    <span className="text-gray-500">開き方向:</span>
                    <span className="ml-1 text-gray-900">{selectedElement.properties.swingDirection}</span>
                  </div>
                )}
                {selectedElement.type === 'window' && selectedElement.properties.glassType && (
                  <div>
                    <span className="text-gray-500">ガラスタイプ:</span>
                    <span className="ml-1 text-gray-900">{selectedElement.properties.glassType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 表示制御パネル（下部固定） */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 z-30 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-6 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="show-walls"
                checked={visibility.walls}
                onChange={() => toggleVisibility('walls')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="show-walls" className="text-sm text-gray-700">壁</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="show-doors"
                checked={visibility.doors}
                onChange={() => toggleVisibility('doors')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="show-doors" className="text-sm text-gray-700">ドア</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="show-windows"
                checked={visibility.windows}
                onChange={() => toggleVisibility('windows')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="show-windows" className="text-sm text-gray-700">窓</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="show-floor"
                checked={visibility.floor}
                onChange={() => toggleVisibility('floor')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="show-floor" className="text-sm text-gray-700">床</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="show-ceiling"
                checked={visibility.ceiling}
                onChange={() => toggleVisibility('ceiling')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="show-ceiling" className="text-sm text-gray-700">天井</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsometricView; 