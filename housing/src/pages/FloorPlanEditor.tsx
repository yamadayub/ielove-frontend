import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Text } from 'react-konva';
import { ArrowLeft, Save, ZoomIn, ZoomOut, RotateCw, Trash2, Grid, Move, Menu, X, Minus, Square, MousePointer, Plus } from 'lucide-react';
import type { KonvaEventObject } from '../types/konva';

interface FloorElement {
  id: string;
  type: 'wall' | 'door' | 'window';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: {
    thickness?: number;
    length?: number;
    height?: number;
    material?: string;
    // 窓専用のFrom To高さ設定
    heightFrom?: number; // 床からの高さ (mm)
    heightTo?: number;   // 上端の高さ (mm)
    // 入力中の一時的な値を保存するためのフィールド
    [key: string]: any;
  };
}

interface PropertyInfo {
  propertyType: 'detached_house' | 'apartment_renovation';
  projectName: string;
  address: string;
  floorPlan: string;
  floorType: string;
  floorArea: string;
  budget: string;
  timeline: string;
  description: string;
}

interface Floor {
  id: string;
  name: string;
  elements: FloorElement[];
}

const FloorPlanEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyInfo: PropertyInfo = location.state?.propertyInfo;
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [floors, setFloors] = useState<Floor[]>([
    { id: '1', name: '1階', elements: [] }
  ]);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'select' | 'wall' | 'door' | 'window'>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [gridVisible, setGridVisible] = useState(true);
  const [gridSize] = useState(20);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // ウィンドウサイズ変更時のステージサイズ更新
  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        setStageSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, [sidebarOpen]);

  const currentFloor = floors[currentFloorIndex];

  // グリッドにスナップする関数
  const snapToGrid = (value: number): number => {
    return Math.round(value / gridSize) * gridSize;
  };

  // mmからピクセルに変換
  const mmToPixels = (mm: number): number => {
    // 1mm = 0.1ピクセル（スケール調整可能）
    return mm * 0.1;
  };

  // ピクセルからmmに変換
  const pixelsToMm = (pixels: number): number => {
    return pixels / 0.1;
  };

  // グリッドを描画
  const renderGrid = () => {
    if (!gridVisible) return null;

    const lines = [];
    const canvasWidth = stageSize.width / scale;
    const canvasHeight = stageSize.height / scale;

    // 縦線
    for (let i = 0; i <= Math.ceil(canvasWidth / gridSize); i++) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[i * gridSize, 0, i * gridSize, canvasHeight]}
          stroke="#e5e7eb"
          strokeWidth={0.5 / scale}
        />
      );
    }

    // 横線
    for (let i = 0; i <= Math.ceil(canvasHeight / gridSize); i++) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, i * gridSize, canvasWidth, i * gridSize]}
          stroke="#e5e7eb"
          strokeWidth={0.5 / scale}
        />
      );
    }

    return lines;
  };

  // 要素を追加
  const addElement = (type: 'wall' | 'door' | 'window', position?: { x: number; y: number }) => {
    const newElement: FloorElement = {
      id: `${type}_${Date.now()}`,
      type,
      x: position ? snapToGrid(position.x) : 100,
      y: position ? snapToGrid(position.y) : 100,
      width: type === 'wall' ? 200 : type === 'door' ? 80 : 120,
      height: type === 'wall' ? 20 : type === 'door' ? 20 : 20,
      rotation: 0,
      properties: {
        thickness: type === 'wall' ? 150 : 100, // mm
        length: type === 'wall' ? 2000 : type === 'door' ? 800 : 1200, // mm
        height: type === 'wall' ? 2400 : type === 'door' ? 2100 : 1200, // mm
        material: type === 'wall' ? 'concrete' : type === 'door' ? 'wood' : 'glass',
        ...(type === 'window' && {
          heightFrom: 900, // 床から90cm
          heightTo: 2100   // 床から210cm
        })
      }
    };

    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? { ...floor, elements: [...floor.elements, newElement] }
        : floor
    ));
  };

  // ステージクリック処理
  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    
    if (clickedOnEmpty) {
      setSelectedElementId(null);
      
      // ツールが選択されている場合は要素を追加
      if (selectedTool !== 'select') {
        const stage = e.target.getStage();
        const pointerPosition = stage?.getPointerPosition();
        if (pointerPosition && stage) {
          const x = (pointerPosition.x - stagePos.x) / scale;
          const y = (pointerPosition.y - stagePos.y) / scale;
          addElement(selectedTool, { x, y });
          setSelectedTool('select');
        }
      }
    }
  };

  // 要素クリック処理
  const handleElementClick = (element: FloorElement, e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    setSelectedElementId(element.id);
  };

  // 要素プロパティ更新
  const updateElementPropertyFixed = (property: string, value: any) => {
    if (!selectedElementId) return;
    
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === selectedElementId 
                ? { 
                    ...el, 
                    properties: { ...el.properties, [property]: value }
                  } 
                : el
            )
          }
        : floor
    ));
  };

  // 要素ドラッグ処理
  const handleElementDragMove = (elementId: string, e: KonvaEventObject<DragEvent>) => {
    const newX = snapToGrid(e.target.x());
    const newY = snapToGrid(e.target.y());
    
    e.target.x(newX);
    e.target.y(newY);

    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId ? { ...el, x: newX, y: newY } : el
            )
          }
        : floor
    ));
  };

  // 要素を描画
  const renderElement = (element: FloorElement) => {
    const isSelected = selectedElementId === element.id;
    
    const getElementColor = (type: string) => {
      switch (type) {
        case 'wall': return '#6b7280';
        case 'door': return '#d97706';
        case 'window': return '#3b82f6';
        default: return '#6b7280';
      }
    };

    const getElementStroke = (type: string) => {
      switch (type) {
        case 'wall': return '#374151';
        case 'door': return '#92400e';
        case 'window': return '#1e40af';
        default: return '#374151';
      }
    };

    const handleElementClickLocal = (e: KonvaEventObject<MouseEvent>) => {
      handleElementClick(element, e);
    };

    return (
      <React.Fragment key={element.id}>
        <Rect
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          fill={getElementColor(element.type)}
          stroke={isSelected ? '#ef4444' : getElementStroke(element.type)}
          strokeWidth={isSelected ? 2 : 1}
          rotation={element.rotation}
          draggable={selectedTool === 'select'}
          onClick={handleElementClickLocal}
          onDragMove={(e: any) => handleElementDragMove(element.id, e)}
        />
        {isSelected && (
          <>
            {/* 選択時の角のハンドル */}
            <Circle
              x={element.x}
              y={element.y}
              radius={4}
              fill="#ef4444"
            />
            <Circle
              x={element.x + element.width}
              y={element.y}
              radius={4}
              fill="#ef4444"
            />
            <Circle
              x={element.x + element.width}
              y={element.y + element.height}
              radius={4}
              fill="#ef4444"
            />
            <Circle
              x={element.x}
              y={element.y + element.height}
              radius={4}
              fill="#ef4444"
            />
          </>
        )}
        {/* 要素ラベル - 要素の中央に配置 */}
        <Text
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          text={element.type === 'wall' ? '壁' : element.type === 'door' ? 'ドア' : '窓'}
          fontSize={12}
          fill="white"
          align="center"
          verticalAlign="middle"
          offsetX={element.type === 'wall' ? 6 : element.type === 'door' ? 9 : 6}
          offsetY={6}
          listening={false}
        />
      </React.Fragment>
    );
  };

  // ツールドラッグ開始
  const handleToolDragStart = (e: React.DragEvent<HTMLButtonElement>, toolType: 'wall' | 'door' | 'window') => {
    e.dataTransfer.setData('toolType', toolType);
  };

  // ステージドロップ処理
  const handleStageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const toolType = e.dataTransfer.getData('toolType') as 'wall' | 'door' | 'window';
    if (toolType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - stagePos.x) / scale;
      const y = (e.clientY - rect.top - stagePos.y) / scale;
      addElement(toolType, { x, y });
    }
  };

  const handleStageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBack = () => {
    navigate('/property-info');
  };

  const handleSave = () => {
    // プロジェクトを保存
    const projectData = {
      propertyInfo,
      floors,
      savedAt: new Date().toISOString()
    };
    
    // ローカルストレージに保存（実際のアプリではAPIに送信）
    localStorage.setItem(`project_${propertyInfo?.projectName || 'untitled'}`, JSON.stringify(projectData));
    
    alert('プロジェクトが保存されました');
    navigate('/dashboard');
  };

  // ズーム機能
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleZoomReset = () => {
    setScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  const selectedElement = selectedElementId 
    ? currentFloor.elements.find(el => el.id === selectedElementId)
    : null;

  // ホイールズーム
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.02;
    const stage = e.target.getStage();
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    setScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/housing/property-info')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">戻る</span>
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">間取り設計</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setGridVisible(!gridVisible)}
                className={`p-2 rounded-md ${gridVisible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                title="グリッド表示切替"
              >
                <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">保存</span>
                <Save className="h-4 w-4 sm:hidden" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* ツールパネル */}
        <div className="w-full lg:w-64 bg-white border-r border-gray-200 p-4 lg:overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">描画ツール</h3>
              <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                {[
                  { tool: 'wall', icon: Minus, label: '壁' },
                  { tool: 'door', icon: Square, label: 'ドア' },
                  { tool: 'window', icon: Square, label: '窓' },
                  { tool: 'select', icon: MousePointer, label: '選択' }
                ].map(({ tool, icon: Icon, label }) => (
                  <button
                    key={tool}
                    onClick={() => setSelectedTool(tool as any)}
                    className={`flex items-center justify-center lg:justify-start p-2 lg:p-3 rounded-md text-sm ${
                      selectedTool === tool
                        ? 'bg-blue-100 text-blue-600 border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    } border`}
                  >
                    <Icon className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* プロパティパネル */}
            {selectedElementId && selectedElement && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">
                  {selectedElement.type === 'wall' && '壁のプロパティ'}
                  {selectedElement.type === 'door' && 'ドアのプロパティ'}
                  {selectedElement.type === 'window' && '窓のプロパティ'}
                </h3>
                
                {selectedElement.type === 'wall' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        長さ (mm)
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.length || ''}
                        onChange={(e) => updateElementPropertyFixed('length', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="2000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        厚さ (mm)
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.thickness || ''}
                        onChange={(e) => updateElementPropertyFixed('thickness', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="120"
                      />
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'door' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        幅 (mm)
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.width || ''}
                        onChange={(e) => updateElementPropertyFixed('width', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        高さ (mm)
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.height || ''}
                        onChange={(e) => updateElementPropertyFixed('height', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="2000"
                      />
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'window' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        幅 (mm)
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.width || ''}
                        onChange={(e) => updateElementPropertyFixed('width', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="1200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        高さ (mm)
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.height || ''}
                        onChange={(e) => updateElementPropertyFixed('height', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        床からの高さ (mm)
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.heightFrom || ''}
                        onChange={(e) => updateElementPropertyFixed('heightFrom', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="800"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 階層管理 */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">階層</h3>
              <div className="space-y-2">
                {floors.map((floor, index) => (
                  <div
                    key={floor.id}
                    className={`p-2 rounded border cursor-pointer ${
                      currentFloorIndex === index ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setCurrentFloorIndex(index)}
                  >
                    <div className="text-sm font-medium">{floor.name}</div>
                    <div className="text-xs text-gray-500">{floor.elements.length}個の要素</div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newFloor: Floor = {
                      id: (floors.length + 1).toString(),
                      name: `${floors.length + 1}階`,
                      elements: []
                    };
                    setFloors(prev => [...prev, newFloor]);
                    setCurrentFloorIndex(floors.length);
                  }}
                  className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400"
                >
                  + 階層を追加
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* キャンバスエリア */}
        <div className="flex-1 relative overflow-hidden" ref={containerRef}>
          <div className="absolute inset-0 bg-gray-100">
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              scaleX={scale}
              scaleY={scale}
              x={stagePos.x}
              y={stagePos.y}
              onWheel={handleWheel}
              onClick={handleStageClick}
              ref={stageRef}
              draggable={selectedTool === 'select'}
            >
              <Layer>
                {/* グリッド */}
                {renderGrid()}
                
                {/* 現在の階層の要素を描画 */}
                {floors[currentFloorIndex]?.elements.map((element) => renderElement(element))}
              </Layer>
            </Stage>
          </div>

          {/* ズームコントロール */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
            <button
              onClick={handleZoomIn}
              className="block w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
              title="ズームイン"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="block w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
              title="ズームアウト"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="block w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-xs font-medium"
              title="ズームリセット"
            >
              1:1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanEditor; 