import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Text, Arc } from 'react-konva';
import { ArrowLeft, Save, ZoomIn, ZoomOut, RotateCw, Trash2, Grid, Move, Menu, X, Minus, Square, MousePointer, Plus, RectangleHorizontal, Home, DoorOpen, Eye } from 'lucide-react';
import type { KonvaEventObject } from '../types/konva';
import Konva from 'konva';

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
  const [gridSize] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  
  // 入力フィールド専用の状態を追加
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});

  // アイソメトリック図から戻ってきた場合のデータ初期化
  useEffect(() => {
    const floorsFromState = location.state?.floors as Floor[];
    if (floorsFromState && floorsFromState.length > 0) {
      console.log('Received floors from isometric view:', floorsFromState); // デバッグ用
      setFloors(floorsFromState);
    }
  }, [location.state?.floors]);

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

  // グリッドにスナップする関数（100mm単位）
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
      x: position ? pixelsToMm(position.x) : 1000, // mm単位で保存
      y: position ? pixelsToMm(position.y) : 1000, // mm単位で保存
      width: type === 'wall' ? 2000 : 
             type === 'door' ? 800 : 
             1200, // mm単位で保存
      height: type === 'wall' ? 120 : // 壁の厚み: 120mm
              type === 'door' ? 35 : 
              40, // 窓の幅: 40mm
      rotation: 0,
      properties: {
        ...(type === 'wall' && {
          thickness: 120, // 壁の厚み: 120mm
          length: 2000,
          height: 2400,
          material: 'concrete'
        }),
        ...(type === 'door' && {
          length: 800,
          width: 35,
          height: 2000,
          material: 'wood',
          swingDirection: 'right'
        }),
        ...(type === 'window' && {
          length: 1200, // 窓の長さ: 1200mm
          width: 40,    // 窓の幅: 40mm
          height: 1200, // 窓の高さ: 1200mm
          heightFrom: 800, // 床からの高さ: 800mm
          glassWidth: 10, // ガラス幅: 10mm
          windowType: 'sliding',
          glassType: 'single'
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
      setInputValues({}); // 入力フィールドの状態をクリア
      
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
    console.log('Element clicked:', element.id, element.type); // デバッグ用
    setSelectedElementId(element.id);
    
    // 選択された要素のプロパティを入力フィールドの状態に設定
    const newInputValues: {[key: string]: string} = {};
    Object.keys(element.properties).forEach(key => {
      const value = element.properties[key];
      newInputValues[key] = value !== undefined ? String(value) : '';
    });
    setInputValues(newInputValues);
  };

  // 要素削除
  const deleteElement = (elementId: string) => {
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? { ...floor, elements: floor.elements.filter(el => el.id !== elementId) }
        : floor
    ));
    setSelectedElementId(null);
    setInputValues({}); // 入力フィールドの状態をクリア
  };

  // 要素回転
  const rotateElement = (elementId: string) => {
    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId 
                ? { ...el, rotation: (el.rotation + 90) % 360 }
                : el
            )
          }
        : floor
    ));
  };

  // 要素プロパティ更新
  const updateElementPropertyFixed = (property: string, value: any) => {
    if (!selectedElementId) return;

    // 入力フィールドの状態を更新
    setInputValues(prev => ({
      ...prev,
      [property]: value
    }));

    setFloors(prev => prev.map((floor, index) => 
      index === currentFloorIndex 
        ? {
            ...floor,
            elements: floor.elements.map(element => {
              if (element.id === selectedElementId) {
                const updatedElement = {
                  ...element,
                  properties: {
                    ...element.properties,
                    [property]: value
                  }
                };

                // サイズを更新（数値の場合のみ）- mm単位で直接保存
                const numericValue = parseFloat(value);
                if (!isNaN(numericValue) && numericValue > 0) {
                  if (element.type === 'wall') {
                    if (property === 'length') {
                      updatedElement.width = numericValue; // mm単位で保存
                      updatedElement.properties.length = numericValue; // propertiesも同期
                    } else if (property === 'thickness') {
                      updatedElement.height = numericValue; // mm単位で保存
                      updatedElement.properties.thickness = numericValue; // propertiesも同期
                    }
                  } else if (element.type === 'door') {
                    if (property === 'length') {
                      updatedElement.width = numericValue; // mm単位で保存
                      updatedElement.properties.length = numericValue; // propertiesも同期
                    } else if (property === 'width') {
                      updatedElement.height = numericValue; // mm単位で保存
                      updatedElement.properties.width = numericValue; // propertiesも同期
                    }
                  } else if (element.type === 'window') {
                    if (property === 'length') {
                      updatedElement.width = numericValue; // mm単位で保存
                      updatedElement.properties.length = numericValue; // propertiesも同期
                    } else if (property === 'width') {
                      updatedElement.height = numericValue; // mm単位で保存
                      updatedElement.properties.width = numericValue; // propertiesも同期
                    }
                  }
                }

                return updatedElement;
              }
              return element;
            })
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
              el.id === elementId ? { ...el, x: pixelsToMm(newX), y: pixelsToMm(newY) } : el
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

    const handleElementTouchStart = (e: any) => {
      e.cancelBubble = true;
      console.log('Element touched:', element.id, element.type); // デバッグ用
      setSelectedElementId(element.id);
    };

    // 要素のサイズを計算 - mm単位からピクセルに変換
    const elementWidth = mmToPixels(element.width);
    const elementHeight = mmToPixels(element.height);
    const elementX = mmToPixels(element.x);
    const elementY = mmToPixels(element.y);

    return (
      <React.Fragment key={element.id}>
        <Rect
          x={elementX}
          y={elementY}
          width={elementWidth}
          height={elementHeight}
          fill={getElementColor(element.type)}
          stroke={isSelected ? '#ef4444' : getElementStroke(element.type)}
          strokeWidth={isSelected ? 2 : 1}
          rotation={element.rotation}
          draggable={selectedTool === 'select'}
          onClick={handleElementClickLocal}
          onTouchStart={handleElementTouchStart}
          onDragMove={(e: any) => handleElementDragMove(element.id, e)}
        />
        
        {/* ドアの開き軌道を表示 */}
        {element.type === 'door' && (
          <Arc
            x={element.properties.swingDirection === 'right' ? elementX : elementX + elementWidth}
            y={elementY}
            innerRadius={0}
            outerRadius={elementWidth}
            angle={90}
            rotation={element.rotation + (element.properties.swingDirection === 'right' ? 0 : 180)}
            fill="rgba(217, 119, 6, 0.2)"
            stroke="#d97706"
            strokeWidth={1}
            dash={[5, 5]}
            listening={false}
          />
        )}
        
        {/* 窓の場合、ガラス断面を表示 */}
        {element.type === 'window' && (
          <>
            {/* 左側の窓枠 */}
            <Rect
              x={elementX}
              y={elementY}
              width={elementWidth / 2}
              height={elementHeight}
              fill="rgba(200, 200, 200, 0.8)"
              stroke="#666"
              strokeWidth={1}
            />
            
            {/* 右側の窓枠 */}
            <Rect
              x={elementX + elementWidth / 2}
              y={elementY}
              width={elementWidth / 2}
              height={elementHeight}
              fill="rgba(200, 200, 200, 0.8)"
              stroke="#666"
              strokeWidth={1}
            />
            
            {/* 左側のガラス面 */}
            <Rect
              x={elementX}
              y={elementY + mmToPixels(15)} // 40mmの中央付近に配置
              width={elementWidth / 2}
              height={mmToPixels((element.properties as any).glassWidth || 10)}
              fill="rgba(173, 216, 230, 0.6)"
              stroke="rgba(100, 149, 237, 0.8)"
              strokeWidth={1}
            />
            
            {/* 右側のガラス面 */}
            <Rect
              x={elementX + elementWidth / 2}
              y={elementY + mmToPixels(15)} // 40mmの中央付近に配置
              width={elementWidth / 2}
              height={mmToPixels((element.properties as any).glassWidth || 10)}
              fill="rgba(173, 216, 230, 0.6)"
              stroke="rgba(100, 149, 237, 0.8)"
              strokeWidth={1}
            />
          </>
        )}
        
        {isSelected && (
          <>
            {/* 選択時の角のハンドル */}
            <Circle
              x={elementX}
              y={elementY}
              radius={4}
              fill="#ef4444"
            />
            <Circle
              x={elementX + elementWidth}
              y={elementY}
              radius={4}
              fill="#ef4444"
            />
            <Circle
              x={elementX + elementWidth}
              y={elementY + elementHeight}
              radius={4}
              fill="#ef4444"
            />
            <Circle
              x={elementX}
              y={elementY + elementHeight}
              radius={4}
              fill="#ef4444"
            />
          </>
        )}
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
    console.log('保存中...', {
      floors,
      propertyInfo
    });
    
    // TODO: APIに保存処理を実装
    alert('間取りを保存しました');
  };

  const handleViewIsometric = () => {
    navigate('/isometric-view', {
      state: {
        floors,
        propertyInfo
      }
    });
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
    <div className="floor-plan-editor min-h-screen bg-gray-50 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            <div className="flex items-center min-w-0">
              <button
                onClick={() => navigate('/housing/property-info')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-2 sm:mr-4 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="hidden sm:inline">戻る</span>
              </button>
              <h1 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">間取り設計</h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
              <button
                onClick={() => setGridVisible(!gridVisible)}
                className={`p-1.5 sm:p-2 rounded-md ${gridVisible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                title="グリッド表示切替"
              >
                <Grid className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </button>
              <button
                onClick={handleViewIsometric}
                className="p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                title="アイソメトリック図を表示"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-md hover:bg-blue-700 text-xs sm:text-sm lg:text-base"
              >
                <span className="hidden sm:inline">保存</span>
                <Save className="h-3 w-3 sm:hidden" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 階層タブ - ヘッダーの下に配置 */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-1 sm:py-2 overflow-x-auto">
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
          {floors.map((floor, index) => (
            <button
              key={floor.id}
              onClick={() => setCurrentFloorIndex(index)}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                index === currentFloorIndex
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {floor.name}
            </button>
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
            className="px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 transition-colors whitespace-nowrap"
          >
            + 階を追加
          </button>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)]">
        {/* ツールパネル - スマホでは上部に横並び、デスクトップでは左側に縦並び */}
        <div className="w-full lg:w-64 bg-white border-b lg:border-r lg:border-b-0 border-gray-200 p-2 sm:p-4 lg:h-full lg:overflow-y-auto">
          <div className="flex lg:flex-col space-x-1 sm:space-x-2 lg:space-x-0 lg:space-y-4 justify-center lg:justify-start">
            {/* 選択ツール */}
            <button
              onClick={() => setSelectedTool('select')}
              className={`p-1.5 sm:p-2 rounded-md transition-colors flex-shrink-0 ${
                selectedTool === 'select'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MousePointer className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* 壁ツール */}
            <button
              onClick={() => addElement('wall')}
              className="p-1.5 sm:p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* ドアツール */}
            <button
              onClick={() => addElement('door')}
              className="p-1.5 sm:p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <DoorOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* 窓ツール */}
            <button
              onClick={() => addElement('window')}
              className="p-1.5 sm:p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <RectangleHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* メインエリア */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
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
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white rounded-lg shadow-lg p-1 sm:p-2 space-y-1 sm:space-y-2">
              <button
                onClick={handleZoomIn}
                className="block w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
                title="ズームイン"
              >
                <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="block w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
                title="ズームアウト"
              >
                <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={handleZoomReset}
                className="block w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-xs font-medium"
                title="ズームリセット"
              >
                1:1
              </button>
            </div>
          </div>

          {/* プロパティパネル - レスポンシブ対応と縦スクロール修正 */}
          {selectedElementId && selectedElement && (
            <div className="bg-white border-t border-gray-200 p-4 h-80 lg:h-96 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedElement.type === 'wall' && '壁のプロパティ'}
                    {selectedElement.type === 'door' && 'ドアのプロパティ'}
                    {selectedElement.type === 'window' && '窓のプロパティ'}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => rotateElement(selectedElementId)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="90度回転"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteElement(selectedElementId)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                      title="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedElementId(null);
                        setInputValues({}); // 入力フィールドの状態をクリア
                      }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="閉じる"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {/* 基本情報 */}
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">基本情報</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>位置: X={Math.round(selectedElement.x)}mm, Y={Math.round(selectedElement.y)}mm</div>
                      <div>
                        サイズ: {Math.round(selectedElement.width)}×{Math.round(selectedElement.height)}mm
                      </div>
                      <div>回転: {selectedElement.rotation}°</div>
                      {selectedElement.type === 'wall' && (
                        <div>高さ: {selectedElement.properties.height || 2400}mm</div>
                      )}
                      {selectedElement.type === 'door' && (
                        <div>高さ: {selectedElement.properties.height || 2000}mm</div>
                      )}
                      {selectedElement.type === 'window' && (
                        <>
                          <div>高さ: {selectedElement.properties.height || 1200}mm</div>
                          <div>床からの高さ: {selectedElement.properties.heightFrom || 800}mm</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* プロパティ編集フィールド */}
                  {selectedElement.type === 'wall' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          長さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.length || selectedElement.width || ''}
                          onChange={(e) => updateElementPropertyFixed('length', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2000"
                          min="100"
                          step="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          厚さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.thickness || selectedElement.height || ''}
                          onChange={(e) => updateElementPropertyFixed('thickness', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="120"
                          min="50"
                          step="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          高さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.height || selectedElement.properties.height || ''}
                          onChange={(e) => updateElementPropertyFixed('height', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2400"
                          min="1000"
                          step="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          材質
                        </label>
                        <select
                          value={inputValues.material || selectedElement.properties.material || 'concrete'}
                          onChange={(e) => updateElementPropertyFixed('material', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="concrete">コンクリート</option>
                          <option value="wood">木造</option>
                          <option value="steel">鉄骨</option>
                          <option value="brick">レンガ</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  {selectedElement.type === 'door' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          長さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.length || selectedElement.width || ''}
                          onChange={(e) => updateElementPropertyFixed('length', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="800"
                          min="600"
                          step="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          厚さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.width || selectedElement.height || ''}
                          onChange={(e) => updateElementPropertyFixed('width', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="35"
                          min="20"
                          step="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          高さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.height || selectedElement.properties.height || ''}
                          onChange={(e) => updateElementPropertyFixed('height', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2000"
                          min="1800"
                          step="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          開き方向
                        </label>
                        <select
                          value={inputValues.swingDirection || selectedElement.properties.swingDirection || 'right'}
                          onChange={(e) => updateElementPropertyFixed('swingDirection', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="left">左開き</option>
                          <option value="right">右開き</option>
                          <option value="inward">内開き</option>
                          <option value="outward">外開き</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          材質
                        </label>
                        <select
                          value={inputValues.material || selectedElement.properties.material || 'wood'}
                          onChange={(e) => updateElementPropertyFixed('material', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="wood">木製</option>
                          <option value="steel">スチール</option>
                          <option value="glass">ガラス</option>
                          <option value="aluminum">アルミ</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  {selectedElement.type === 'window' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          幅 (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.length || selectedElement.width || ''}
                          onChange={(e) => updateElementPropertyFixed('length', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1200"
                          min="300"
                          step="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          高さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.height || selectedElement.properties.height || ''}
                          onChange={(e) => updateElementPropertyFixed('height', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1200"
                          min="300"
                          step="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          床からの高さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.heightFrom || selectedElement.properties.heightFrom || ''}
                          onChange={(e) => updateElementPropertyFixed('heightFrom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="800"
                          min="0"
                          step="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          上端の高さ (mm)
                        </label>
                        <input
                          type="number"
                          value={inputValues.heightTo || selectedElement.properties.heightTo || ''}
                          onChange={(e) => updateElementPropertyFixed('heightTo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2000"
                          min="500"
                          step="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ガラスタイプ
                        </label>
                        <select
                          value={inputValues.glassType || selectedElement.properties.glassType || 'single'}
                          onChange={(e) => updateElementPropertyFixed('glassType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="single">単板ガラス</option>
                          <option value="double">複層ガラス</option>
                          <option value="triple">三層ガラス</option>
                          <option value="low-e">Low-Eガラス</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          フレーム材質
                        </label>
                        <select
                          value={inputValues.frameType || selectedElement.properties.frameType || 'aluminum'}
                          onChange={(e) => updateElementPropertyFixed('frameType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="aluminum">アルミ</option>
                          <option value="wood">木製</option>
                          <option value="vinyl">樹脂</option>
                          <option value="composite">複合材</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorPlanEditor; 