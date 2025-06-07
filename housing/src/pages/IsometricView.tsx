import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { Grid, Text } from '@react-three/drei';
import { RotateCcw, Grid3X3, Box, X, ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react';
import * as THREE from 'three';

interface FloorElement {
  id: string;
  type: 'wall' | 'door' | 'window';
  x: number; // mm単位の座標
  y: number; // mm単位の座標
  width: number; // mm単位のサイズ（長さ）
  height: number; // mm単位のサイズ（厚み/幅）
  rotation: number;
  properties: {
    thickness?: number;
    length?: number;
    height?: number;
    material?: string;
    heightFrom?: number;
    heightTo?: number;
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
  
  // 要素のデータから直接寸法を取得（mm単位）
  const wallLength = element.width / 1000; // mmをmに変換
  const wallThickness = element.height / 1000; // mmをmに変換
  const wallHeight = (element.properties.height || 2400) / 1000; // mmをmに変換
  
  // 座標変換：平面図の左上原点からアイソメ図の中央原点へ
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット（10m部屋の場合）
  const y = wallHeight / 2; // 床から壁の高さの半分の位置
  const z = (element.y - 5000) / 1000; // Y軸を反転せず、中央配置のオフセット

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      rotation={[0, (element.rotation * Math.PI) / 180, 0]}
    >
      <boxGeometry args={[wallLength, wallHeight, wallThickness]} />
      <meshStandardMaterial 
        color={isSelected ? "#3b82f6" : "#e5e7eb"} 
        transparent={isSelected}
        opacity={isSelected ? 0.8 : 1}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(wallLength, wallHeight, wallThickness)]} />
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
  
  // 要素のデータから直接寸法を取得（mm単位）
  const doorLength = element.width / 1000; // mmをmに変換
  const doorWidth = element.height / 1000; // mmをmに変換
  const doorHeight = (element.properties.height || 2000) / 1000; // mmをmに変換
  
  // 座標変換：平面図の左上原点からアイソメ図の中央原点へ
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット（10m部屋の場合）
  const y = doorHeight / 2; // 床からドアの高さの半分の位置
  const z = (element.y - 5000) / 1000; // Y軸を反転せず、中央配置のオフセット

  return (
    <group>
      {/* ドア枠 */}
      <mesh
        position={[x, y, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[doorLength, doorHeight, doorWidth]} />
        <meshStandardMaterial 
          color={isSelected ? "#f59e0b" : "#8b4513"} 
          transparent={isSelected}
          opacity={isSelected ? 0.8 : 1}
        />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(doorLength, doorHeight, doorWidth)]} />
            <lineBasicMaterial color="#d97706" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* ドアハンドル */}
      <mesh
        position={[x + doorLength * 0.3, y - doorHeight * 0.1, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <sphereGeometry args={[0.02]} />
        <meshStandardMaterial color="#ffd700" />
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
  
  // 要素のデータから直接寸法を取得（mm単位）
  const windowLength = element.width / 1000; // mmをmに変換
  const windowWidth = element.height / 1000; // mmをmに変換
  const windowHeight = (element.properties.height || 2000) / 1000; // mmをmに変換
  const windowFromFloor = (element.properties.heightFromFloor || 0) / 1000; // 床からの高さ
  
  // 座標変換：平面図の左上原点からアイソメ図の中央原点へ
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット（10m部屋の場合）
  const y = windowFromFloor + windowHeight / 2; // 床からの高さ + 窓の高さの半分
  const z = (element.y - 5000) / 1000; // Y軸を反転せず、中央配置のオフセット

  return (
    <group>
      {/* 窓枠 */}
      <mesh
        position={[x, y, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[windowLength, windowHeight, windowWidth]} />
        <meshStandardMaterial 
          color={isSelected ? "#10b981" : "#87ceeb"} 
          transparent 
          opacity={isSelected ? 0.9 : 0.7} 
        />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(windowLength, windowHeight, windowWidth)]} />
            <lineBasicMaterial color="#059669" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* 窓枠の境界線 */}
      <mesh
        position={[x, y - windowHeight / 2 + 0.01, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[windowLength, 0.02, windowWidth]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh
        position={[x, y + windowHeight / 2 - 0.01, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[windowLength, 0.02, windowWidth]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  );
};

// 床コンポーネント
const Floor: React.FC = () => {
  const floorSize = 10; // 10m×10mの正方形
  
  return (
    <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[floorSize, floorSize]} />
      <meshStandardMaterial color="#f5f5f4" />
    </mesh>
  );
};

// 天井コンポーネント
const Ceiling: React.FC = () => {
  const ceilingSize = 10; // 10m×10mの正方形
  const ceilingHeight = 2.4; // 2.4mの高さ
  
  return (
    <mesh position={[0, ceilingHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[ceilingSize, ceilingSize]} />
      <meshStandardMaterial color="#ffffff" side={2} />
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
}> = ({ floors, propertyInfo, showGrid, selectedElement, onElementSelect, onBackgroundClick, zoom }) => {
  
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
      <Floor />
      
      {/* 天井 */}
      <Ceiling />
      
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
          
          if (element.type === 'wall') {
            return <Wall key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          } else if (element.type === 'door') {
            return <Door key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          } else if (element.type === 'window') {
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

  return (
    <div className="h-full flex flex-col">
      {/* サブヘッダー - ツールバー */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* 戻るボタン */}
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="前の画面に戻る"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">戻る</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* ツールボタン */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="グリッド表示切替"
            >
              <Grid3X3 className="h-4 w-4" />
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

      {/* メインアイソメトリックビューエリア */}
      <div className="flex-1 relative">
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
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default IsometricView; 