import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { RotateCcw, ZoomIn, ZoomOut, Grid3X3, Box, X, ArrowLeft } from 'lucide-react';
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
  // 平面図: 左上原点、X右向き、Y下向き
  // アイソメ図: 中央原点、X右向き、Y上向き、Z手前向き
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット（10m部屋の場合）
  const y = wallHeight / 2; // 床から壁の高さの半分の位置
  const z = (element.y - 5000) / 1000; // Y軸を反転せず、中央配置のオフセット
  const width = wallLength;
  const height = wallHeight;
  const depth = wallThickness;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(element);
  };

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      onClick={handleClick}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial 
        color={isSelected ? "#3b82f6" : "#e5e7eb"} 
        transparent={isSelected}
        opacity={isSelected ? 0.8 : 1}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
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
  const width = doorLength;
  const height = doorHeight;
  const depth = doorWidth;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(element);
  };

  return (
    <group onClick={handleClick}>
      {/* ドア枠 */}
      <mesh
        position={[x, y, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={isSelected ? "#f59e0b" : "#8b4513"} 
          transparent={isSelected}
          opacity={isSelected ? 0.8 : 1}
        />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
            <lineBasicMaterial color="#d97706" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* ドアハンドル */}
      <mesh
        position={[x + width * 0.3, y - height * 0.1, z]}
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
  const windowHeight = (element.properties.height || 1200) / 1000; // mmをmに変換
  const windowFromFloor = (element.properties.heightFromFloor || 800) / 1000; // 床からの高さ
  
  // 座標変換：平面図の左上原点からアイソメ図の中央原点へ
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット（10m部屋の場合）
  const y = windowFromFloor + windowHeight / 2; // 床からの高さ + 窓の高さの半分
  const z = (element.y - 5000) / 1000; // Y軸を反転せず、中央配置のオフセット
  const width = windowLength;
  const height = windowHeight;
  const depth = windowWidth;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(element);
  };

  return (
    <group onClick={handleClick}>
      {/* 窓枠 */}
      <mesh
        position={[x, y, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={isSelected ? "#10b981" : "#87ceeb"} 
          transparent 
          opacity={isSelected ? 0.9 : 0.7} 
        />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
            <lineBasicMaterial color="#059669" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      {/* 窓枠の境界線 */}
      <mesh
        position={[x, y - height / 2 + 0.01, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh
        position={[x, y + height / 2 - 0.01, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[width, 0.02, depth]} />
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

// 3Dシーンコンポーネント
const Scene: React.FC<{ 
  floors: Floor[]; 
  propertyInfo: PropertyInfo; 
  isWireframe: boolean;
  selectedElement: FloorElement | null;
  onElementSelect: (element: FloorElement) => void;
  onBackgroundClick: () => void;
}> = ({ floors, propertyInfo, isWireframe, selectedElement, onElementSelect, onBackgroundClick }) => {
  
  const handleBackgroundClick = () => {
    onBackgroundClick();
  };

  return (
    <>
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

const ThreeDView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const controlsRef = useRef<any>(null);
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

  const [isWireframe, setIsWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedElement, setSelectedElement] = useState<FloorElement | null>(null);
  const [isEditingProperties, setIsEditingProperties] = useState(false);
  const [editingProperties, setEditingProperties] = useState<any>({});
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

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

    // 初期サイズ設定
    updateCanvasSize();

    // ウィンドウリサイズ時のサイズ更新
    window.addEventListener('resize', updateCanvasSize);
    
    // 少し遅延してもう一度サイズを更新（DOM構築完了後）
    const timer = setTimeout(updateCanvasSize, 100);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      clearTimeout(timer);
    };
  }, []);

  // デバッグ用の出力
  useEffect(() => {
    console.log('3D View - Floors:', floors);
    console.log('3D View - Property Info:', propertyInfo);
    console.log('3D View - Canvas Size:', canvasSize);
    if (floors.length > 0) {
      console.log('3D View - Elements in first floor:', floors[0].elements);
    }
  }, [floors, propertyInfo, canvasSize]);

  // カメラリセット
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      // カメラ位置もリセット
      controlsRef.current.object.position.set(10, 10, 10);
      controlsRef.current.object.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // ビュー変更
  const changeView = (position: [number, number, number]) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(position[0], position[1], position[2]);
      controlsRef.current.object.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // ワイヤーフレーム切替
  const toggleWireframe = () => {
    setIsWireframe(!isWireframe);
  };

  // グリッド切替
  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  // 要素選択処理
  const handleElementSelect = (element: FloorElement) => {
    console.log('Element selected:', element);
    setSelectedElement(element);
    setIsEditingProperties(false);
    
    // プロパティを編集用の状態にコピー
    setEditingProperties({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      length: element.properties.length || element.width,
      thickness: element.properties.thickness || element.height,
      elementHeight: element.properties.height || 2400,
      material: element.properties.material || '',
      ...element.properties
    });
  };

  // 背景クリック処理（選択解除）
  const handleBackgroundClick = () => {
    console.log('Background clicked, deselecting element');
    setSelectedElement(null);
    setIsEditingProperties(false);
    setEditingProperties({});
  };

  // プロパティ変更処理
  const handlePropertyChange = (key: string, value: string | number) => {
    setEditingProperties((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // 変更を保存
  const saveChanges = () => {
    if (!selectedElement) return;

    // 実際の要素を更新（実際のアプリケーションではAPIコールが必要）
    console.log('Saving changes:', editingProperties);
    
    // 一時的にローカル状態を更新（デモ用）
    const updatedElement = {
      ...selectedElement,
      x: parseFloat(editingProperties.x) || selectedElement.x,
      y: parseFloat(editingProperties.y) || selectedElement.y,
      width: parseFloat(editingProperties.length) || selectedElement.width,
      height: parseFloat(editingProperties.thickness) || selectedElement.height,
      properties: {
        ...selectedElement.properties,
        length: parseFloat(editingProperties.length) || selectedElement.properties.length,
        thickness: parseFloat(editingProperties.thickness) || selectedElement.properties.thickness,
        height: parseFloat(editingProperties.elementHeight) || selectedElement.properties.height,
        material: editingProperties.material || selectedElement.properties.material
      }
    };
    
    setSelectedElement(updatedElement);
    alert('変更を保存しました（デモ用）');
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
          <div className="flex items-center space-x-2">
            {/* 戻るボタン */}
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="前の画面に戻る"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">戻る</span>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">3Dビュー</h2>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* ツールボタン */}
            <button
              onClick={toggleGrid}
              className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="グリッド表示切替"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={toggleWireframe}
              className={`p-2 rounded-lg transition-colors ${isWireframe ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="ワイヤーフレーム切替"
            >
              <Box className="h-4 w-4" />
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
      <div className="flex-1 relative">
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
              isWireframe={isWireframe}
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
              onBackgroundClick={handleBackgroundClick}
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

        {/* 選択された要素の詳細表示 */}
        {selectedElement && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border max-w-lg mx-auto" style={{ height: '400px' }}>
            {/* ヘッダー（固定） */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedElement.type === 'wall' && '壁'}
                {selectedElement.type === 'door' && 'ドア'}  
                {selectedElement.type === 'window' && '窓'}
                の編集
              </h3>
              <button
                onClick={handleBackgroundClick}
                className="p-1 text-gray-600 hover:text-gray-900 rounded flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* スクロール可能なコンテンツエリア */}
            <div className="p-4 overflow-y-auto" style={{ height: 'calc(400px - 120px)' }}>
              <div className="space-y-4">
                {/* サイズ */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">サイズ (mm)</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {selectedElement.type === 'wall' ? '長さ' : '幅'}
                      </label>
                      <input
                        type="number"
                        value={editingProperties.length || ''}
                        onChange={(e) => handlePropertyChange('length', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="100"
                        step="50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {selectedElement.type === 'wall' ? '厚さ' : '奥行き'}
                      </label>
                      <input
                        type="number"
                        value={editingProperties.thickness || ''}
                        onChange={(e) => handlePropertyChange('thickness', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="10"
                        step="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">高さ</label>
                      <input
                        type="number"
                        value={editingProperties.elementHeight || ''}
                        onChange={(e) => handlePropertyChange('elementHeight', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="100"
                        step="100"
                      />
                    </div>
                  </div>
                </div>

                {/* 位置 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">位置 (mm)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">X座標</label>
                      <input
                        type="number"
                        value={editingProperties.x || ''}
                        onChange={(e) => handlePropertyChange('x', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Y座標</label>
                      <input
                        type="number"
                        value={editingProperties.y || ''}
                        onChange={(e) => handlePropertyChange('y', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="10"
                      />
                    </div>
                  </div>
                </div>

                {/* 壁の場合のプロパティ */}
                {selectedElement.type === 'wall' && (
                  <>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">壁紙</h4>
                      <select
                        value={editingProperties.wallpaper || ''}
                        onChange={(e) => handlePropertyChange('wallpaper', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        <option value="white">ホワイト</option>
                        <option value="beige">ベージュ</option>
                        <option value="light_gray">ライトグレー</option>
                        <option value="cream">クリーム</option>
                        <option value="wood_pattern">木目調</option>
                        <option value="stone_pattern">石調</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">塗装</h4>
                      <select
                        value={editingProperties.paint || ''}
                        onChange={(e) => handlePropertyChange('paint', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        <option value="matt">マット</option>
                        <option value="satin">サテン</option>
                        <option value="gloss">グロス</option>
                        <option value="eggshell">エッグシェル</option>
                      </select>
                    </div>
                  </>
                )}

                {/* ドアの場合のプロパティ */}
                {selectedElement.type === 'door' && (
                  <>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">ドアタイプ</h4>
                      <select
                        value={editingProperties.doorType || ''}
                        onChange={(e) => handlePropertyChange('doorType', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        <option value="swing">開き戸</option>
                        <option value="sliding">引き戸</option>
                        <option value="bi_fold">二つ折り</option>
                        <option value="pocket">引き込み戸</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">ハンドルタイプ</h4>
                      <select
                        value={editingProperties.handleType || ''}
                        onChange={(e) => handlePropertyChange('handleType', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        <option value="lever">レバーハンドル</option>
                        <option value="knob">ノブハンドル</option>
                        <option value="pull">プルハンドル</option>
                        <option value="push_pull">プッシュプル</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 窓の場合のプロパティ */}
                {selectedElement.type === 'window' && (
                  <>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">窓タイプ</h4>
                      <select
                        value={editingProperties.windowType || ''}
                        onChange={(e) => handlePropertyChange('windowType', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        <option value="sliding">引き違い窓</option>
                        <option value="casement">開き窓</option>
                        <option value="awning">突き出し窓</option>
                        <option value="fixed">FIX窓</option>
                        <option value="bay">出窓</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">ガラスタイプ</h4>
                      <select
                        value={editingProperties.glassType || ''}
                        onChange={(e) => handlePropertyChange('glassType', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        <option value="single">単板ガラス</option>
                        <option value="double">複層ガラス</option>
                        <option value="triple">三層ガラス</option>
                        <option value="low_e">Low-Eガラス</option>
                        <option value="frosted">すりガラス</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* フッター（固定） */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={saveChanges}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  保存
                </button>
                <button
                  onClick={handleBackgroundClick}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDView; 