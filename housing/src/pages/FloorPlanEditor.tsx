import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Text } from 'react-konva';
import { ArrowLeft, Save, ZoomIn, ZoomOut, RotateCw, Trash2, Grid, Move } from 'lucide-react';
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
    const stageWidth = 800;
    const stageHeight = 600;

    // 縦線
    for (let i = 0; i < stageWidth / gridSize; i++) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[i * gridSize, 0, i * gridSize, stageHeight]}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />
      );
    }

    // 横線
    for (let i = 0; i < stageHeight / gridSize; i++) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, i * gridSize, stageWidth, i * gridSize]}
          stroke="#e5e7eb"
          strokeWidth={0.5}
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

  // 要素削除
  const deleteElement = (elementId: string) => {
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? { ...floor, elements: floor.elements.filter(el => el.id !== elementId) }
        : floor
    ));
    setSelectedElementId(null);
  };

  // 要素プロパティ更新
  const updateElementProperty = (elementId: string, property: string, value: any) => {
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId 
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

  // プロパティ入力値の変更処理
  const handlePropertyInputChange = (elementId: string, property: string, inputValue: string) => {
    // 入力中は文字列として保持
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId 
                ? { 
                    ...el, 
                    properties: { ...el.properties, [`${property}_input`]: inputValue }
                  } 
                : el
            )
          }
        : floor
    ));
  };

  // 入力値を取得（表示用）
  const getInputValue = (elementId: string, property: string): string => {
    const element = currentFloor.elements.find(el => el.id === elementId);
    if (!element) return '';
    
    // 入力中の値があればそれを返す、なければ実際の値を返す
    const inputKey = `${property}_input`;
    if (element.properties[inputKey] !== undefined) {
      return element.properties[inputKey] as string;
    }
    
    const value = element.properties[property];
    return value !== undefined ? String(value) : '';
  };

  // 入力フィールドのフォーカスが外れた時の処理
  const handleInputBlur = (elementId: string, property: string) => {
    const element = currentFloor.elements.find(el => el.id === elementId);
    if (!element) return;

    const inputKey = `${property}_input`;
    const inputValue = element.properties[inputKey] as string;
    
    if (inputValue !== undefined) {
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue) && numericValue > 0) {
        // 有効な数値の場合、実際の値を更新
        updateElementProperty(elementId, property, numericValue);
        
        // 寸法に応じてキャンバス上のサイズも更新
        if (property === 'length' || property === 'thickness') {
          const newWidth = property === 'length' ? mmToPixels(numericValue) : element.width;
          const newHeight = property === 'thickness' ? mmToPixels(numericValue) : element.height;
          updateElementSize(elementId, newWidth, newHeight);
        }
      }
      
      // 入力中の値をクリア
      setFloors(prev => prev.map((floor, index) => 
        index === currentFloorIndex 
          ? {
              ...floor,
              elements: floor.elements.map(el => 
                el.id === elementId 
                  ? { 
                      ...el, 
                      properties: { ...el.properties, [inputKey]: undefined }
                    } 
                  : el
              )
            }
          : floor
      ));
    }
  };

  // 要素サイズ更新
  const updateElementSize = (elementId: string, width: number, height: number) => {
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId ? { ...el, width, height } : el
            )
          }
        : floor
    ));
  };

  // 要素回転更新
  const updateElementRotation = (elementId: string, rotation: number) => {
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId ? { ...el, rotation } : el
            )
          }
        : floor
    ));
  };

  // 要素を90度回転
  const rotateElement = (elementId: string) => {
    const element = currentFloor.elements.find(el => el.id === elementId);
    if (element) {
      updateElementRotation(elementId, (element.rotation + 90) % 360);
    }
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

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
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
          onClick={handleClick}
          onDragMove={(e) => handleElementDragMove(element.id, e)}
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
        {/* 要素ラベル */}
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
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
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
    <div className="h-screen flex flex-col bg-gray-50">
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
            <h1 className="text-lg font-semibold text-gray-900">
              {propertyInfo?.projectName || '間取り編集'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="縮小"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              title="リセット"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="拡大"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              保存
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ツールパネル */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* ツール選択 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">ツール</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTool('select')}
                  className={`p-3 text-sm rounded-md border ${
                    selectedTool === 'select'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Move className="w-4 h-4 mx-auto mb-1" />
                  選択
                </button>
                <button
                  onClick={() => setSelectedTool('wall')}
                  draggable
                  onDragStart={(e) => handleToolDragStart(e, 'wall')}
                  className={`p-3 text-sm rounded-md border ${
                    selectedTool === 'wall'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  壁
                </button>
                <button
                  onClick={() => setSelectedTool('door')}
                  draggable
                  onDragStart={(e) => handleToolDragStart(e, 'door')}
                  className={`p-3 text-sm rounded-md border ${
                    selectedTool === 'door'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ドア
                </button>
                <button
                  onClick={() => setSelectedTool('window')}
                  draggable
                  onDragStart={(e) => handleToolDragStart(e, 'window')}
                  className={`p-3 text-sm rounded-md border ${
                    selectedTool === 'window'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  窓
                </button>
              </div>
            </div>

            {/* グリッド設定 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">表示設定</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={gridVisible}
                  onChange={(e) => setGridVisible(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">グリッド表示</span>
              </label>
            </div>

            {/* 選択要素のプロパティ */}
            {selectedElement && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">プロパティ</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      種類
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedElement.type === 'wall' ? '壁' : 
                       selectedElement.type === 'door' ? 'ドア' : '窓'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      長さ (mm)
                    </label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'length')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'length', e.target.value)}
                      onBlur={() => handleInputBlur(selectedElement.id, 'length')}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      厚さ (mm)
                    </label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'thickness')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'thickness', e.target.value)}
                      onBlur={() => handleInputBlur(selectedElement.id, 'thickness')}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      高さ (mm)
                    </label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'height')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'height', e.target.value)}
                      onBlur={() => handleInputBlur(selectedElement.id, 'height')}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  {selectedElement.type === 'window' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          床からの高さ (mm)
                        </label>
                        <input
                          type="number"
                          value={getInputValue(selectedElement.id, 'heightFrom')}
                          onChange={(e) => handlePropertyInputChange(selectedElement.id, 'heightFrom', e.target.value)}
                          onBlur={() => handleInputBlur(selectedElement.id, 'heightFrom')}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          上端の高さ (mm)
                        </label>
                        <input
                          type="number"
                          value={getInputValue(selectedElement.id, 'heightTo')}
                          onChange={(e) => handlePropertyInputChange(selectedElement.id, 'heightTo', e.target.value)}
                          onBlur={() => handleInputBlur(selectedElement.id, 'heightTo')}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => rotateElement(selectedElement.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <RotateCw className="w-3 h-3 mr-1" />
                      回転
                    </button>
                    <button
                      onClick={() => deleteElement(selectedElement.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      削除
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* キャンバス */}
        <div 
          className="flex-1 bg-gray-100 overflow-hidden"
          onDrop={handleStageDrop}
          onDragOver={handleStageDragOver}
        >
          <Stage
            ref={stageRef}
            width={window.innerWidth - 256}
            height={window.innerHeight - 60}
            scaleX={scale}
            scaleY={scale}
            x={stagePos.x}
            y={stagePos.y}
            onClick={handleStageClick}
            onWheel={handleWheel}
            draggable={selectedTool === 'select'}
            onDragEnd={(e) => {
              setStagePos({
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          >
            <Layer>
              {/* グリッド */}
              {renderGrid()}
              
              {/* 要素 */}
              {currentFloor.elements.map(element => renderElement(element))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanEditor; 