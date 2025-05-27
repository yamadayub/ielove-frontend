import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Home, Eye, Grid3X3, Box, Edit3, Save, X } from 'lucide-react';
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
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット
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
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット
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
  const x = (element.x - 5000) / 1000; // 中央に配置するためのオフセット
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
        position={[x, y, z]}
        rotation={[0, (element.rotation * Math.PI) / 180, 0]}
      >
        <boxGeometry args={[width + 0.02, height + 0.02, depth + 0.01]} />
        <meshStandardMaterial color="#2f4f4f" wireframe />
      </mesh>
    </group>
  );
};

// 床コンポーネント
const Floor: React.FC<{ floorArea: string }> = ({ floorArea }) => {
  // 床面積から大まかなサイズを計算（正方形と仮定）
  const area = parseFloat(floorArea) || 100;
  const size = Math.sqrt(area);
  
  return null; // 床の表示を削除
};

// シーンコンポーネント
const Scene: React.FC<{ 
  floors: Floor[]; 
  propertyInfo: PropertyInfo; 
  isWireframe: boolean;
  selectedElement: FloorElement | null;
  onElementSelect: (element: FloorElement) => void;
  onBackgroundClick: () => void;
}> = ({ floors, propertyInfo, isWireframe, selectedElement, onElementSelect, onBackgroundClick }) => {
  const currentFloor = floors[0] || { elements: [] };
  
  return (
    <>
      {/* 照明 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, 10, -5]} intensity={0.4} />
      
      {/* 床 */}
      <Floor floorArea={propertyInfo.floorArea} />
      
      {/* グリッド */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#e0e0e0"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#c0c0c0"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      
      {/* 背景クリック用の透明な平面 */}
      <mesh 
        position={[0, -0.02, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={onBackgroundClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* 間取り要素 */}
      {currentFloor.elements.map((element) => {
        const isSelected = selectedElement?.id === element.id;
        switch (element.type) {
          case 'wall':
            return <Wall key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          case 'door':
            return <Door key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          case 'window':
            return <Window key={element.id} element={element} isSelected={isSelected} onSelect={onElementSelect} />;
          default:
            return null;
        }
      })}
      
      {/* プロジェクト名表示 */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {propertyInfo.projectName}
      </Text>
    </>
  );
};

const IsometricView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([10, 8, 10]);
  const [isWireframe, setIsWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedElement, setSelectedElement] = useState<FloorElement | null>(null);
  const [editingProperties, setEditingProperties] = useState<FloorElement['properties'] | null>(null);
  const [originalProperties, setOriginalProperties] = useState<FloorElement['properties'] | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  
  // 入力フィールド専用の状態を追加
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});
  
  // floor-plan-editorから渡されたデータを取得
  const initialFloors = location.state?.floors as Floor[] || [];
  const propertyInfo = location.state?.propertyInfo as PropertyInfo || {
    propertyType: 'detached_house',
    projectName: 'サンプルプロジェクト',
    floorPlan: '3LDK',
    floorType: '平屋',
    floorArea: '100',
    timeline: '3-6ヶ月',
    description: ''
  };

  useEffect(() => {
    setFloors(initialFloors);
  }, [initialFloors]);

  const handleBack = () => {
    // 現在の floors 状態を基準にして、編集中の変更があれば反映
    let finalFloors = [...floors];
    
    // 編集中の要素がある場合は、その変更を最終的な状態に反映
    if (selectedElement && editingProperties) {
      finalFloors = finalFloors.map(floor => ({
        ...floor,
        elements: floor.elements.map(element => 
          element.id === selectedElement.id 
            ? { ...element, properties: { ...editingProperties } }
            : element
        )
      }));
    }
    
    console.log('Returning to floor plan with floors:', finalFloors); // デバッグ用
    
    navigate('/floor-plan-editor', { 
      state: { 
        floors: finalFloors,
        propertyInfo 
      } 
    });
  };

  const resetCamera = () => {
    setCameraPosition([10, 8, 10]);
  };

  const changeView = (position: [number, number, number]) => {
    setCameraPosition(position);
  };

  const toggleWireframe = () => {
    setIsWireframe(!isWireframe);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const handleElementSelect = (element: FloorElement) => {
    setSelectedElement(element);
    setEditingProperties({ ...element.properties });
    setOriginalProperties({ ...element.properties });
    
    // 選択された要素のプロパティを入力フィールドの状態に設定
    const newInputValues: {[key: string]: string} = {};
    Object.keys(element.properties).forEach(key => {
      const value = element.properties[key];
      newInputValues[key] = value !== undefined ? String(value) : '';
    });
    setInputValues(newInputValues);
  };

  const handleBackgroundClick = () => {
    setSelectedElement(null);
    setEditingProperties(null);
    setOriginalProperties(null);
    setInputValues({}); // 入力フィールドの状態をクリア
  };

  const handlePropertyChange = (key: string, value: string | number) => {
    if (editingProperties && selectedElement) {
      // 入力フィールドの状態を更新（文字列として保存）
      setInputValues(prev => ({
        ...prev,
        [key]: String(value)
      }));
      
      // プロパティの更新処理
      let updatedValue: string | number = value;
      
      // 数値フィールドの場合の処理
      if (typeof value === 'string' && ['length', 'thickness', 'height', 'width', 'heightFromFloor', 'heightFrom', 'heightTo', 'glassWidth'].includes(key)) {
        // 空文字列の場合はそのまま保存（削除を許可）
        if (value === '') {
          updatedValue = '';
        } else {
          // 数値に変換可能な場合のみ数値として保存
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue) && numericValue >= 0) {
            updatedValue = numericValue;
          } else {
            // 無効な値の場合は文字列として保存（入力中の状態を保持）
            updatedValue = value;
          }
        }
      }
      
      const updatedProperties = {
        ...editingProperties,
        [key]: updatedValue
      };
      setEditingProperties(updatedProperties);
      
      // 有効な数値の場合のみリアルタイムで3Dビューに反映
      if (typeof updatedValue === 'number' || (typeof updatedValue === 'string' && updatedValue !== '' && !isNaN(parseFloat(updatedValue)))) {
        const numericValue = typeof updatedValue === 'number' ? updatedValue : parseFloat(updatedValue);
        
        const updatedFloors = floors.map(floor => ({
          ...floor,
          elements: floor.elements.map(element => {
            if (element.id === selectedElement.id) {
              const updatedElement = { ...element, properties: updatedProperties };
              
              // プロパティ変更に応じて要素のサイズも更新（mm単位で直接保存）
              if (element.type === 'wall') {
                if (key === 'length') {
                  updatedElement.width = numericValue; // mm単位で保存
                } else if (key === 'thickness') {
                  updatedElement.height = numericValue; // mm単位で保存
                }
              } else if (element.type === 'door') {
                if (key === 'length') {
                  updatedElement.width = numericValue; // mm単位で保存
                } else if (key === 'width') {
                  updatedElement.height = numericValue; // mm単位で保存
                }
              } else if (element.type === 'window') {
                if (key === 'length') {
                  updatedElement.width = numericValue; // mm単位で保存
                } else if (key === 'width') {
                  updatedElement.height = numericValue; // mm単位で保存
                }
              }
              
              return updatedElement;
            }
            return element;
          })
        }));
        setFloors(updatedFloors);
        
        // 選択された要素も更新
        const updatedSelectedElement = updatedFloors
          .flatMap(floor => floor.elements)
          .find(element => element.id === selectedElement.id);
        if (updatedSelectedElement) {
          setSelectedElement(updatedSelectedElement);
        }
      }
    }
  };

  const cancelEdit = () => {
    if (selectedElement && originalProperties) {
      // 元の値に戻す
      setEditingProperties({ ...originalProperties });
      
      // 3Dビューも元の値に戻す
      const updatedFloors = floors.map(floor => ({
        ...floor,
        elements: floor.elements.map(element => 
          element.id === selectedElement.id 
            ? { ...element, properties: originalProperties }
            : element
        )
      }));
      setFloors(updatedFloors);
      
      // 選択された要素も元の値に戻す
      setSelectedElement({ ...selectedElement, properties: originalProperties });
    }
  };

  const saveProperties = () => {
    // リアルタイム更新により保存機能は不要
    // 編集完了として選択を解除
    handleBackgroundClick();
  };

  const getElementTypeName = (type: string) => {
    switch (type) {
      case 'wall': return '壁';
      case 'door': return 'ドア';
      case 'window': return '窓';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              戻る
            </button>
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-blue-600 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">
                アイソメトリック図 - {propertyInfo.projectName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ツールバー - レスポンシブ対応 */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* 視点プリセット */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => changeView([10, 8, 10])}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              アイソメトリック
            </button>
            <button
              onClick={() => changeView([0, 15, 0])}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              平面図
            </button>
            <button
              onClick={() => changeView([20, 5, 0])}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              側面図
            </button>
            <button
              onClick={() => changeView([0, 5, 20])}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              正面図
            </button>
          </div>

          {/* 表示設定 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleWireframe}
              className={`p-2 rounded-md transition-colors ${
                isWireframe
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="ワイヤーフレーム切り替え"
            >
              <Box className="w-4 h-4" />
            </button>
            <button
              onClick={toggleGrid}
              className={`p-2 rounded-md transition-colors ${
                showGrid
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="グリッド切り替え"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={resetCamera}
              className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              title="カメラリセット"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* 3Dビューエリア */}
        <div className="flex-1 relative">
          <Canvas
            camera={{
              position: cameraPosition,
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            style={{ background: '#f8fafc' }}
          >
            <Scene floors={floors} propertyInfo={propertyInfo} isWireframe={isWireframe} selectedElement={selectedElement} onElementSelect={handleElementSelect} onBackgroundClick={handleBackgroundClick} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 2}
              minDistance={5}
              maxDistance={50}
            />
          </Canvas>
          
          {/* 操作ヒント */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600">
            <div className="space-y-1">
              <div>マウス左ドラッグ: 回転</div>
              <div>マウス右ドラッグ: 移動</div>
              <div>ホイール: ズーム</div>
            </div>
          </div>
        </div>

        {/* サイドパネル - レスポンシブ対応 */}
        <div className="w-full lg:w-80 bg-white border-t lg:border-l lg:border-t-0 border-gray-200 p-4 overflow-y-auto max-h-96 lg:max-h-full">
          <div className="space-y-6">
            {/* 選択された要素のプロパティ編集 */}
            {selectedElement && (
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                    {getElementTypeName(selectedElement.type)}の編集
                  </h3>
                  <button
                    onClick={handleBackgroundClick}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {editingProperties && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        幅 (mm)
                      </label>
                      <input
                        type="number"
                        value={inputValues.length !== undefined ? inputValues.length : (
                          selectedElement.width || ''
                        )}
                        onChange={(e) => handlePropertyChange('length', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {selectedElement.type === 'wall' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            厚さ (mm)
                          </label>
                          <input
                            type="number"
                            value={inputValues.thickness !== undefined ? inputValues.thickness : (selectedElement.height || '')}
                            onChange={(e) => handlePropertyChange('thickness', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            高さ (mm)
                          </label>
                          <input
                            type="number"
                            value={inputValues.height !== undefined ? inputValues.height : (selectedElement.properties.height || '')}
                            onChange={(e) => handlePropertyChange('height', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                    
                    {selectedElement.type === 'door' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            奥行き (mm)
                          </label>
                          <input
                            type="number"
                            value={inputValues.width !== undefined ? inputValues.width : (selectedElement.height || '')}
                            onChange={(e) => handlePropertyChange('width', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            高さ (mm)
                          </label>
                          <input
                            type="number"
                            value={inputValues.height !== undefined ? inputValues.height : (selectedElement.properties.height || '')}
                            onChange={(e) => handlePropertyChange('height', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                    
                    {selectedElement.type === 'window' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            奥行き (mm)
                          </label>
                          <input
                            type="number"
                            value={inputValues.width !== undefined ? inputValues.width : (selectedElement.height || '')}
                            onChange={(e) => handlePropertyChange('width', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            高さ (mm)
                          </label>
                          <input
                            type="number"
                            value={inputValues.height !== undefined ? inputValues.height : (selectedElement.properties.height || '')}
                            onChange={(e) => handlePropertyChange('height', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            床からの高さ (mm)
                          </label>
                          <input
                            type="number"
                            value={inputValues.heightFromFloor !== undefined ? inputValues.heightFromFloor : (selectedElement.properties.heightFromFloor || '')}
                            onChange={(e) => handlePropertyChange('heightFromFloor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* 完了・キャンセルボタン */}
                    <div className="flex space-x-2 pt-4">
                      <button
                        onClick={saveProperties}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        完了
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm"
                      >
                        元に戻す
                      </button>
                    </div>
                    
                    {/* リアルタイム編集の説明 */}
                    <div className="bg-green-50 p-2 rounded-md mt-3">
                      <p className="text-xs text-green-700">
                        💡 変更は即座に3Dビューに反映されます
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* プロジェクト情報 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                プロジェクト情報
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">種別:</span>
                  <span className="font-medium">
                    {propertyInfo.propertyType === 'detached_house' ? '戸建て住宅' : 'マンションリノベーション'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">間取り:</span>
                  <span className="font-medium">{propertyInfo.floorPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">床面積:</span>
                  <span className="font-medium">{propertyInfo.floorArea}㎡</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">工期:</span>
                  <span className="font-medium">{propertyInfo.timeline}</span>
                </div>
              </div>
            </div>

            {/* 要素統計 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                設計要素
              </h3>
              <div className="space-y-2 text-sm">
                {floors.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">壁:</span>
                      <span className="font-medium">
                        {floors[0].elements.filter(e => e.type === 'wall').length}個
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ドア:</span>
                      <span className="font-medium">
                        {floors[0].elements.filter(e => e.type === 'door').length}個
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">窓:</span>
                      <span className="font-medium">
                        {floors[0].elements.filter(e => e.type === 'window').length}個
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 操作ヒント */}
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">操作方法</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• 3D要素をクリックして選択</div>
                <div>• 選択した要素のプロパティを編集</div>
                <div>• 背景をクリックして選択解除</div>
              </div>
            </div>

            {/* 要望・備考 */}
            {propertyInfo.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  要望・備考
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {propertyInfo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsometricView; 