import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Canvas, useFrame, ThreeEvent, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { RotateCcw, ZoomIn, ZoomOut, Grid3X3, Box, X, ArrowLeft, Map, Layers, Grid2X2 } from 'lucide-react';
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
  
  // 座標変換：平面図の左上原点から3D図の中央原点へ
  // 8m×6mの部屋の中央を原点(0,0,0)とする
  const x = (element.x + element.dimensions.width / 2 - 4000) / 1000; // 4m(部屋の幅の半分)をオフセット
  const y = wallHeight / 2; // 床から壁の高さの半分の位置
  const z = (element.y + element.dimensions.depth / 2 - 3000) / 1000; // 3m(部屋の奥行きの半分)をオフセット

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(element);
  };

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      onClick={handleClick}
      renderOrder={1}
    >
      <boxGeometry args={[wallWidth, wallHeight, wallDepth]} />
      <meshBasicMaterial 
        map={isSelected ? undefined : wallTexture}
        color={isSelected ? "#3b82f6" : "#ffffff"} 
        transparent={false}
        opacity={1}
      />
      {isSelected && (
        <lineSegments renderOrder={10}>
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
  
  // 座標変換：平面図の左上原点から3D図の中央原点へ
  const x = (element.x + element.dimensions.width / 2 - 4000) / 1000;
  const y = doorHeight / 2; // 床からドアの高さの半分の位置
  const z = (element.y + element.dimensions.depth / 2 - 3000) / 1000;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(element);
  };

  return (
    <group onClick={handleClick}>
      {/* ドア枠 */}
      <mesh
        position={[x, y, z]}
        renderOrder={2}
      >
        <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
        <meshBasicMaterial 
          map={isSelected ? undefined : woodTexture}
          color={isSelected ? "#d97706" : "#ffffff"} 
          transparent={false}
          opacity={1}
        />
        {isSelected && (
          <lineSegments position={[0, 0, 0.002]} renderOrder={10}>
            <edgesGeometry args={[new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth)]} />
            <lineBasicMaterial color="#d97706" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* ドアハンドル */}
      <mesh
        position={[x + doorWidth * 0.3, y - doorHeight * 0.1, z + doorDepth * 0.6]}
        renderOrder={3}
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
  
  // 座標変換：平面図の左上原点から3D図の中央原点へ
  const x = (element.x + element.dimensions.width / 2 - 4000) / 1000;
  const y = windowFromFloor + windowHeight / 2; // 床からの高さ + 窓の高さの半分
  const z = (element.y + element.dimensions.depth / 2 - 3000) / 1000;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(element);
  };

  return (
    <group onClick={handleClick}>
      {/* 窓枠 - メインガラス */}
      <mesh
        position={[x, y, z]}
        renderOrder={4}
      >
        <boxGeometry args={[windowWidth, windowHeight, windowDepth]} />
        <meshBasicMaterial 
          map={isSelected ? undefined : glassTexture}
          color={isSelected ? "#0ea5e9" : "#ffffff"} 
          transparent 
          opacity={isSelected ? 0.7 : 0.4}
          depthWrite={false}
        />
        {isSelected && (
          <lineSegments position={[0, 0, 0.002]} renderOrder={10}>
            <edgesGeometry args={[new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth)]} />
            <lineBasicMaterial color="#0284c7" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* 窓枠 - 上下の枠 */}
      <mesh
        position={[x, y - windowHeight / 2 - 0.02, z]}
        renderOrder={5}
      >
        <boxGeometry args={[windowWidth + 0.02, 0.03, windowDepth + 0.02]} />
        <meshBasicMaterial color="#6b7280" />
      </mesh>
      <mesh
        position={[x, y + windowHeight / 2 + 0.02, z]}
        renderOrder={5}
      >
        <boxGeometry args={[windowWidth + 0.02, 0.03, windowDepth + 0.02]} />
        <meshBasicMaterial color="#6b7280" />
      </mesh>
      {/* 窓枠 - 左右の枠 */}
      <mesh
        position={[x - windowWidth / 2 - 0.02, y, z]}
        renderOrder={5}
      >
        <boxGeometry args={[0.03, windowHeight + 0.06, windowDepth + 0.02]} />
        <meshBasicMaterial color="#6b7280" />
      </mesh>
      <mesh
        position={[x + windowWidth / 2 + 0.02, y, z]}
        renderOrder={5}
      >
        <boxGeometry args={[0.03, windowHeight + 0.06, windowDepth + 0.02]} />
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
    <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}>
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
    <mesh position={[0, ceilingHeight, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={0}>
      <planeGeometry args={[ceilingSize, ceilingSize]} />
      <meshBasicMaterial color="#fafafa" side={2} />
    </mesh>
  );
};

// 3Dシーンコンポーネント
const Scene: React.FC<{ 
  floors: Floor[]; 
  propertyInfo: PropertyInfo; 
  showGrid: boolean;
  selectedElement: FloorElement | null;
  onElementSelect: (element: FloorElement) => void;
  onBackgroundClick: () => void;
  visibility: VisibilityState;
}> = ({ floors, propertyInfo, showGrid, selectedElement, onElementSelect, onBackgroundClick, visibility }) => {
  
  const handleBackgroundClick = () => {
    onBackgroundClick();
  };

  return (
    <>
      {/* シンプルな環境光のみ */}
      <ambientLight intensity={0.8} />
      
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

const ThreeDView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  
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

  const [selectedElement, setSelectedElement] = useState<FloorElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showGrid, setShowGrid] = useState(true);
  
  // 表示制御の状態
  const [visibility, setVisibility] = useState<VisibilityState>({
    walls: true,
    doors: true,
    windows: true,
    floor: true,
    ceiling: false,
  });

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

  // カメラリセット
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      console.log('カメラをリセットしました');
    }
  };

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

  // 前の画面に戻る
  const handleGoBack = () => {
    navigate(-1);
  };

  // 表示制御の切り替え
  const toggleVisibility = (key: keyof VisibilityState) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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

  // アイソメ図に移動
  const handleGoToIsometric = () => {
    navigate('/isometric-view', {
      state: {
        floors,
        propertyInfo
      }
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 144px)' }}>
      {/* サブヘッダー - ツールバー */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
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
              onClick={handleGoToIsometric}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
              title="アイソメ図に移動"
            >
              <Box className="h-4 w-4" />
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
            <button
              onClick={resetCamera}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="カメラリセット"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* メイン3Dビューエリア */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={containerRef}
          className="w-full h-full"
        >
          <Canvas
            camera={{ position: [10, 10, 10], fov: 60 }}
            style={{ 
              background: '#f9fafb',
              width: canvasSize.width,
              height: canvasSize.height
            }}
            dpr={[1, 2]}
            resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
          >
            <Scene 
              floors={floors}
              propertyInfo={propertyInfo}
              showGrid={showGrid}
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
              onBackgroundClick={handleBackgroundClick}
              visibility={visibility}
            />
            <OrbitControls 
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        {/* 要素選択パネル（オーバーレイ） */}
        {selectedElement && (
          <div 
            className="absolute bottom-4 left-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto"
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

      {/* 表示制御パネル（固定フッター） */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0 z-10">
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

export default ThreeDView; 