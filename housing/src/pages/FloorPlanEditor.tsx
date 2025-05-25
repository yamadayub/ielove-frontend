import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff, MousePointer, Minus, DoorOpen, RectangleHorizontal, Trash2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { KonvaEventObject } from 'konva/lib/Node';

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
  };
}

interface Floor {
  id: string;
  name: string;
  elements: FloorElement[];
}

const FloorPlanEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyInfo = location.state?.propertyInfo;
  const stageRef = useRef<any>(null);

  // 建築用900mmグリッド（1グリッド = 900mm = 45px）
  const GRID_SIZE = 45; // 45px = 900mm
  const CANVAS_WIDTH = 5000; // 100m = 100,000mm ÷ 900mm × 45px = 5000px
  const CANVAS_HEIGHT = 5000; // 100m = 100,000mm ÷ 900mm × 45px = 5000px
  const FIXED_CANVAS_HEIGHT = 480; // 600から480に変更（20%削減）

  const [floors, setFloors] = useState<Floor[]>([
    { id: '1F', name: '1階', elements: [] },
    { id: '2F', name: '2階', elements: [] }
  ]);
  const [activeFloor, setActiveFloor] = useState<string>('1F');
  const [selectedTool, setSelectedTool] = useState<'select' | 'wall' | 'door' | 'window'>('select');
  const [selectedElement, setSelectedElement] = useState<FloorElement | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [draggedElementType, setDraggedElementType] = useState<'wall' | 'door' | 'window' | null>(null);

  // 入力中の一時的な値を管理するstate
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});

  // ズーム機能のstate - 初期位置をキャンバス中央に設定
  const [scale, setScale] = useState<number>(0.3); // 初期スケールを0.3に設定して全体が見えるように
  const [stagePosition, setStagePosition] = useState<{ x: number; y: number }>(() => {
    // 初期位置を動的に計算 - キャンバス中央（2500, 2500）を画面中央に
    const viewportWidth = typeof window !== 'undefined' ? 
      (window.innerWidth < 1024 ? window.innerWidth - 32 : Math.max(5000, window.innerWidth - 352)) : 1200;
    const viewportHeight = 480;
    const centerX = (viewportWidth / 2) - (2500 * 0.3);
    const centerY = (viewportHeight / 2) - (2500 * 0.3);
    return { x: centerX, y: centerY };
  });

  // 初期表示時に要素が見える位置にステージを配置
  useEffect(() => {
    const currentFloorElements = floors.find(f => f.id === activeFloor)?.elements || [];
    
    if (currentFloorElements.length > 0) {
      // 要素の中心位置を計算
      const centerX = currentFloorElements.reduce((sum, el) => sum + el.x, 0) / currentFloorElements.length;
      const centerY = currentFloorElements.reduce((sum, el) => sum + el.y, 0) / currentFloorElements.length;
      
      // ステージサイズを取得
      const stageWidth = window.innerWidth < 1024 ? window.innerWidth - 32 : Math.max(CANVAS_WIDTH, window.innerWidth - 352);
      const stageHeight = FIXED_CANVAS_HEIGHT;
      
      // 要素の中心がビューポートの中心に来るようにステージ位置を調整
      const newPosition = {
        x: (stageWidth / 2) - (centerX * scale),
        y: (stageHeight / 2) - (centerY * scale)
      };
      
      console.log('初期表示位置調整:', {
        elementsCount: currentFloorElements.length,
        centerPosition: { x: centerX, y: centerY },
        currentScale: scale,
        newStagePosition: newPosition
      });
      
      setStagePosition(newPosition);
    }
  }, [activeFloor, floors]); // activeFloorまたはfloorsが変更された時に実行

  // グリッドスナップ機能
  const snapToGrid = (value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  // mmからピクセルに変換（1mm = 0.1px）
  const mmToPixels = (mm: number): number => {
    const result = mm * 0.1; // 1mm = 0.1px
    console.log(`mmToPixels: ${mm}mm -> ${result}px`);
    return result;
  };

  // ピクセルからmmに変換
  const pixelsToMm = (pixels: number): number => {
    const result = pixels / 0.1; // 1px = 10mm
    console.log(`pixelsToMm: ${pixels}px -> ${result}mm`);
    return result;
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    
    // デバッグ用: グリッド描画情報を出力
    console.log('グリッド描画中:', {
      showGrid,
      GRID_SIZE,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      linesCount: (CANVAS_WIDTH / GRID_SIZE + 1) + (CANVAS_HEIGHT / GRID_SIZE + 1)
    });
    
    // 縦線
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, CANVAS_HEIGHT]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      );
    }
    
    // 横線
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, CANVAS_WIDTH, i]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      );
    }

    console.log('グリッド線の数:', lines.length);
    return lines;
  };

  const addElement = (type: 'wall' | 'door' | 'window', position?: { x: number; y: number }) => {
    const id = `${type}-${Date.now()}`;
    
    // 固定サイズでテスト（より大きなサイズ）
    let width, height;
    switch (type) {
      case 'wall':
        width = 20;
        height = 100;
        break;
      case 'door':
        width = 80; // 800mm相当
        height = 80; // 800mm相当
        break;
      case 'window':
        width = 120;
        height = 20;
        break;
    }

    const newElement: FloorElement = {
      id,
      type,
      x: position?.x || 1000, // より見やすい位置に配置
      y: position?.y || 1000,
      width,
      height,
      rotation: 0,
      properties: {
        thickness: pixelsToMm(width),
        length: pixelsToMm(height),
        height: 2400, // デフォルト高さ
        material: type === 'wall' ? '木造' : type === 'door' ? '木製ドア' : 'アルミサッシ',
        ...(type === 'window' && {
          heightFrom: 900,
          heightTo: 2100
        })
      }
    };

    console.log('要素を追加:', newElement);

    setFloors(prev => prev.map(floor => 
      floor.id === activeFloor 
        ? { ...floor, elements: [...floor.elements, newElement] }
        : floor
    ));
  };

  // ステージクリックハンドラー
  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    console.log('ステージクリック:', {
      targetClassName: e.target.getClassName(),
      targetName: e.target.name?.() || 'no-name',
      selectedTool,
      currentSelectedElement: selectedElement?.id,
      eventTarget: e.target
    });

    // 背景（Stage）をクリックした場合のみ処理（要素以外をクリック）
    // Rectなどの要素をクリックした場合は処理しない
    if (e.target === stage || e.target.getClassName() === 'Stage') {
      if (selectedTool !== 'select') {
        // ステージの変換を考慮した実際の座標を計算
        const pointerPosition = stage.getPointerPosition();
        if (pointerPosition) {
          // ステージの変換（スケールと位置）を考慮して実際の座標を計算
          const realX = (pointerPosition.x - stagePosition.x) / scale;
          const realY = (pointerPosition.y - stagePosition.y) / scale;
          
          console.log('クリック位置での要素追加:', {
            tool: selectedTool,
            pointerPosition,
            stagePosition,
            scale,
            realPosition: { x: realX, y: realY },
            snappedPosition: { x: snapToGrid(realX), y: snapToGrid(realY) }
          });
          
          // 選択されたツールで要素を配置
          addElement(selectedTool, { x: realX, y: realY });
        }
      } else {
        // 選択ツールの場合は選択を解除
        console.log('選択を解除します');
        setSelectedElement(null);
      }
    } else {
      console.log('要素がクリックされました（ステージクリックハンドラー内）:', e.target.getClassName());
    }
  };

  const handleElementClick = (element: FloorElement, e: any) => {
    console.log('要素クリックイベント発生:', {
      elementId: element.id,
      elementType: element.type,
      targetClassName: e.target?.getClassName?.(),
      currentSelectedElement: selectedElement?.id
    });
    
    e.cancelBubble = true;
    e.evt?.stopPropagation?.();
    
    console.log('要素を選択中:', element.id);
    setSelectedElement(element);
    setSelectedTool('select');
    
    console.log('選択完了:', element.id);
  };

  const handleElementDragMove = (elementId: string, e: KonvaEventObject<DragEvent>) => {
    const position = e.target.position();
    const newX = snapToGrid(position.x);
    const newY = snapToGrid(position.y);
    
    e.target.position({ x: newX, y: newY });

    setFloors(prev => prev.map(floor => 
      floor.id === activeFloor 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId 
                ? { ...el, x: newX, y: newY }
                : el
            )
          }
        : floor
    ));

    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, x: newX, y: newY } : null);
    }
  };

  const deleteElement = (elementId: string) => {
    setFloors(prev => prev.map(floor => 
      floor.id === activeFloor 
        ? { ...floor, elements: floor.elements.filter(el => el.id !== elementId) }
        : floor
    ));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  // プロパティ更新時に要素のサイズも動的に更新
  const updateElementProperty = (elementId: string, property: string, value: any) => {
    // 空文字列や無効な値の場合は処理しない（ただし材質の場合は空文字列も許可）
    if (value === null || value === undefined) {
      return;
    }

    // 数値の場合は正の値のみ許可（材質などの文字列は除く）
    if (typeof value === 'number' && value <= 0) {
      return;
    }

    setFloors(prev => prev.map(floor => 
      floor.id === activeFloor 
        ? {
            ...floor,
            elements: floor.elements.map(el => {
              if (el.id === elementId) {
                const updatedElement = {
                  ...el,
                  properties: { ...el.properties, [property]: value }
                };

                // 長さや厚みが変更された場合、ピクセルサイズも更新
                if (property === 'length' && typeof value === 'number') {
                  updatedElement.height = mmToPixels(value);
                } else if (property === 'thickness' && typeof value === 'number') {
                  updatedElement.width = mmToPixels(value);
                }

                return updatedElement;
              }
              return el;
            })
          }
        : floor
    ));

    // 選択中の要素も更新
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => {
        if (!prev) return null;
        const updatedElement = {
          ...prev,
          properties: { ...prev.properties, [property]: value }
        };

        // 長さや厚みが変更された場合、ピクセルサイズも更新
        if (property === 'length' && typeof value === 'number') {
          updatedElement.height = mmToPixels(value);
        } else if (property === 'thickness' && typeof value === 'number') {
          updatedElement.width = mmToPixels(value);
        }

        return updatedElement;
      });
    }
  };

  // 入力値変更ハンドラー
  const handlePropertyInputChange = (elementId: string, property: string, inputValue: string) => {
    const inputKey = `${elementId}-${property}`;
    
    // 入力中の値を一時的に保存
    setInputValues(prev => ({
      ...prev,
      [inputKey]: inputValue
    }));
    
    // 有効な数値の場合のみ実際のプロパティを更新
    const numericValue = parseInt(inputValue);
    if (!isNaN(numericValue) && numericValue > 0) {
      updateElementProperty(elementId, property, numericValue);
    }
  };

  // 入力フィールドの値を取得する関数
  const getInputValue = (elementId: string, property: string): string => {
    const inputKey = `${elementId}-${property}`;
    const tempValue = inputValues[inputKey];
    
    // 一時的な値がある場合はそれを使用、なければ実際の値を使用
    if (tempValue !== undefined) {
      return tempValue;
    }
    
    const element = selectedElement;
    if (element && element.id === elementId) {
      const value = element.properties[property as keyof typeof element.properties];
      return String(value || 0);
    }
    
    return '0';
  };

  // 入力フィールドのフォーカスが外れた時の処理
  const handleInputBlur = (elementId: string, property: string) => {
    const inputKey = `${elementId}-${property}`;
    const tempValue = inputValues[inputKey];
    
    if (tempValue !== undefined) {
      const numericValue = parseInt(tempValue);
      
      // 無効な値の場合は元の値に戻す
      if (isNaN(numericValue) || numericValue <= 0) {
        const element = selectedElement;
        if (element && element.id === elementId) {
          const value = element.properties[property as keyof typeof element.properties];
          setInputValues(prev => ({
            ...prev,
            [inputKey]: String(value || 0)
          }));
        }
      } else {
        // 有効な値の場合は一時的な値をクリア
        setInputValues(prev => {
          const newValues = { ...prev };
          delete newValues[inputKey];
          return newValues;
        });
      }
    }
  };

  const updateElementSize = (elementId: string, width: number, height: number) => {
    const snappedWidth = snapToGrid(width);
    const snappedHeight = snapToGrid(height);

    setFloors(prev => prev.map(floor => 
      floor.id === activeFloor 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId 
                ? { 
                    ...el, 
                    width: snappedWidth, 
                    height: snappedHeight,
                    properties: {
                      ...el.properties,
                      thickness: pixelsToMm(snappedWidth),
                      length: pixelsToMm(snappedHeight)
                    }
                  }
                : el
            )
          }
        : floor
    ));

    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { 
        ...prev, 
        width: snappedWidth, 
        height: snappedHeight,
        properties: {
          ...prev.properties,
          thickness: pixelsToMm(snappedWidth),
          length: pixelsToMm(snappedHeight)
        }
      } : null);
    }
  };

  const updateElementRotation = (elementId: string, rotation: number) => {
    setFloors(prev => prev.map(floor => 
      floor.id === activeFloor 
        ? {
            ...floor,
            elements: floor.elements.map(el => 
              el.id === elementId 
                ? { ...el, rotation }
                : el
            )
          }
        : floor
    ));

    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, rotation } : null);
    }
  };

  const rotateElement = (elementId: string) => {
    const element = floors.find(f => f.id === activeFloor)?.elements.find(e => e.id === elementId);
    if (element) {
      const newRotation = (element.rotation + 90) % 360;
      updateElementRotation(elementId, newRotation);
    }
  };

  const renderElement = (element: FloorElement) => {
    // 平面図らしい色設定
    const getElementColor = (type: string) => {
      switch (type) {
        case 'wall': return '#4A4A4A'; // 濃いグレー（壁面の断面色）
        case 'door': return '#FFFFFF'; // 白色（ドア本体）
        case 'window': return '#E6F3FF'; // 薄い青色（窓ガラス）
        default: return '#000000';
      }
    };

    const getElementStroke = (type: string) => {
      switch (type) {
        case 'wall': return '#2A2A2A'; // より濃いグレー
        case 'door': return '#8B4513'; // 茶色（ドア枠）
        case 'window': return '#4169E1'; // 青色（窓枠）
        default: return '#000000';
      }
    };

    console.log('要素を描画中:', {
      id: element.id,
      type: element.type,
      position: { x: element.x, y: element.y },
      size: { width: element.width, height: element.height },
      rotation: element.rotation,
      color: getElementColor(element.type),
      scale: scale,
      visibleSize: {
        width: element.width * scale,
        height: element.height * scale
      }
    });

    const handleClick = (e: any) => {
      e.cancelBubble = true;
      e.evt?.stopPropagation?.();
      console.log('要素がクリックされました:', element.id, element.type);
      handleElementClick(element, e);
    };

    const isSelected = selectedElement?.id === element.id;

    // ドアの場合は開閉軌道の円弧も描画
    if (element.type === 'door') {
      const thickness = mmToPixels(35); // 35mm
      const radius = element.width;
      const centerX = element.x + element.width;
      const centerY = element.y;
      
      // 円弧の点を計算（16分割）
      const arcPoints = [];
      for (let i = 0; i <= 16; i++) {
        const angle = (Math.PI / 2) * (i / 16); // 0から90度まで
        const x = centerX - radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        arcPoints.push(x, y);
      }

      return (
        <React.Fragment key={element.id}>
          {/* 扉の開口部背景（透明なスナップ枠） */}
          <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill="transparent"
            stroke="transparent"
            strokeWidth={0}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleClick}
            listening={true}
            draggable={selectedTool === 'select'}
            onDragMove={(e: any) => handleElementDragMove(element.id, e)}
          />
          
          {/* 扉の断面（上辺）- 壁面と同じ濃いグレー */}
          <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={thickness}
            fill="#4A4A4A"
            stroke="#2A2A2A"
            strokeWidth={selectedElement?.id === element.id ? 3 : 2}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleClick}
            listening={true}
          />
          
          {/* 開閉軌道の円弧 */}
          <Line
            points={arcPoints}
            stroke={selectedElement?.id === element.id ? '#FFD700' : '#8B4513'}
            strokeWidth={2}
            dash={[5, 3]}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleClick}
            listening={true}
          />
          
          {/* 円弧の始点から扉の終端への直線（1/4円を完成） */}
          <Line
            points={[
              centerX,          // 円弧始点のX座標（蝶番位置）
              centerY,          // 円弧始点のY座標（蝶番位置）
              element.x,        // 扉の左端X座標
              centerY           // 同じY座標（水平線）
            ]}
            stroke={selectedElement?.id === element.id ? '#FFD700' : '#8B4513'}
            strokeWidth={2}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleClick}
            listening={true}
          />
          
          {/* 蝶番位置のマーク */}
          <Rect
            x={centerX - 3}
            y={centerY - 3}
            width={6}
            height={6}
            fill={selectedElement?.id === element.id ? '#FFD700' : '#8B4513'}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleClick}
            listening={true}
          />
        </React.Fragment>
      );
    }

    // 窓の場合は特別なデザイン
    if (element.type === 'window') {
      return (
        <React.Fragment key={element.id}>
          {/* 窓枠 */}
          <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={getElementColor(element.type)}
            stroke={isSelected ? "#FFD700" : getElementStroke(element.type)}
            strokeWidth={isSelected ? 3 : 2}
            rotation={element.rotation}
            draggable
            listening={true}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleClick}
            onDragEnd={(e: any) => {
              const newX = snapToGrid(e.target.x());
              const newY = snapToGrid(e.target.y());
              setFloors(prev => prev.map(floor => 
                floor.id === activeFloor 
                  ? { 
                      ...floor, 
                      elements: floor.elements.map(el => 
                        el.id === element.id 
                          ? { ...el, x: newX, y: newY }
                          : el
                      )
                    }
                  : floor
              ));
            }}
          />
          {/* 窓の中央線（平面図表現） */}
          <Line
            points={[
              element.x + element.width * 0.1,
              element.y + element.height / 2,
              element.x + element.width * 0.9,
              element.y + element.height / 2
            ]}
            stroke={getElementStroke(element.type)}
            strokeWidth={1}
            rotation={element.rotation}
            listening={false}
          />
        </React.Fragment>
      );
    }

    // 壁の場合（デフォルト）
    return (
      <Rect
        key={element.id}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill={getElementColor(element.type)}
        stroke={isSelected ? "#FFD700" : getElementStroke(element.type)}
        strokeWidth={isSelected ? 3 : 2}
        rotation={element.rotation}
        draggable
        listening={true}
        onClick={handleClick}
        onTap={handleClick}
        onMouseDown={handleClick}
        onDragEnd={(e: any) => {
          const newX = snapToGrid(e.target.x());
          const newY = snapToGrid(e.target.y());
          setFloors(prev => prev.map(floor => 
            floor.id === activeFloor 
              ? { 
                  ...floor, 
                  elements: floor.elements.map(el => 
                    el.id === element.id 
                      ? { ...el, x: newX, y: newY }
                      : el
                  )
                }
              : floor
          ));
        }}
      />
    );
  };

  // ツールボタンのドラッグ開始ハンドラー
  const handleToolDragStart = (e: React.DragEvent<HTMLButtonElement>, toolType: 'wall' | 'door' | 'window') => {
    setDraggedElementType(toolType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleStageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedElementType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addElement(draggedElementType, { x, y });
      setDraggedElementType(null);
    }
  };

  const handleStageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBack = () => {
    navigate('/property-info');
  };

  const handleSave = () => {
    console.log('保存データ:', { propertyInfo, floors });
    navigate('/dashboard');
  };

  const currentFloor = floors.find(f => f.id === activeFloor);
  const elementCount = currentFloor?.elements.length || 0;

  // デバッグ用: 現在の階層の要素を出力
  console.log('現在の階層:', activeFloor, '要素数:', elementCount, '要素:', currentFloor?.elements);

  // selectedElementの状態変化を監視
  useEffect(() => {
    console.log('selectedElement状態変化:', {
      selectedElement: selectedElement ? {
        id: selectedElement.id,
        type: selectedElement.type,
        position: { x: selectedElement.x, y: selectedElement.y }
      } : null
    });
  }, [selectedElement]);

  // ズーム機能
  const handleZoomIn = () => {
    const newScale = Math.min(scale * 1.2, 3); // 最大3倍
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale / 1.2, 0.1); // 最小0.1倍に変更（より広範囲を表示可能）
    setScale(newScale);
  };

  const handleZoomReset = () => {
    setScale(0.5); // より大きなスケールに設定
    
    // 現在の階層の要素を取得
    const currentFloorElements = floors.find(f => f.id === activeFloor)?.elements || [];
    
    if (currentFloorElements.length > 0) {
      // 要素の中心位置を計算
      const centerX = currentFloorElements.reduce((sum, el) => sum + el.x, 0) / currentFloorElements.length;
      const centerY = currentFloorElements.reduce((sum, el) => sum + el.y, 0) / currentFloorElements.length;
      
      // ステージサイズを取得
      const stageWidth = window.innerWidth < 1024 ? window.innerWidth - 32 : Math.max(CANVAS_WIDTH, window.innerWidth - 352);
      const stageHeight = FIXED_CANVAS_HEIGHT;
      
      // 要素の中心がビューポートの中心に来るようにステージ位置を調整
      const newPosition = {
        x: (stageWidth / 2) - (centerX * 0.5),
        y: (stageHeight / 2) - (centerY * 0.5)
      };
      
      console.log('ズームリセット:', {
        elementsCount: currentFloorElements.length,
        centerPosition: { x: centerX, y: centerY },
        stageSize: { width: stageWidth, height: stageHeight },
        newStagePosition: newPosition,
        scale: 0.5
      });
      
      setStagePosition(newPosition);
    } else {
      // 要素がない場合はキャンバス中央を表示
      const stageWidth = window.innerWidth < 1024 ? window.innerWidth - 32 : Math.max(CANVAS_WIDTH, window.innerWidth - 352);
      const stageHeight = FIXED_CANVAS_HEIGHT;
      
      setStagePosition({
        x: (stageWidth / 2) - (CANVAS_WIDTH * 0.5 / 2),
        y: (stageHeight / 2) - (CANVAS_HEIGHT * 0.5 / 2)
      });
    }
  };

  // マウスホイールでのズーム
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.max(0.1, Math.min(3, newScale)); // 最小値を0.1に変更

    setScale(clampedScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    setStagePosition(newPos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">戻る</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">間取り編集</h1>
            <span className="hidden md:inline text-xs text-gray-500">
              グリッド: 900mm ({elementCount}個)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-md ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Save className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* 階層タブ */}
      <div className="bg-white border-b border-gray-200 px-4 flex-shrink-0">
        <div className="grid grid-cols-2 gap-0 w-full">
          {floors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => setActiveFloor(floor.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 text-center ${
                activeFloor === floor.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {floor.name} ({floor.elements.length})
            </button>
          ))}
        </div>
      </div>

      {/* ツールパネル */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">ツール:</span>
          <div className="flex space-x-2">
            {[
              { id: 'select', icon: MousePointer, label: '要素選択' },
              { id: 'wall', icon: Minus, label: '壁' },
              { id: 'door', icon: DoorOpen, label: '扉' },
              { id: 'window', icon: RectangleHorizontal, label: '窓' }
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  draggable={tool.id !== 'select'}
                  onDragStart={(e) => tool.id !== 'select' && handleToolDragStart(e, tool.id as 'wall' | 'door' | 'window')}
                  onClick={() => setSelectedTool(tool.id as any)}
                  className={`p-2 rounded-md border flex-shrink-0 ${
                    selectedTool === tool.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title={tool.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
            {/* 将来のツール用のスペースを確保 */}
            <div className="flex space-x-2 opacity-50">
              <div className="p-2 rounded-md border border-gray-200 bg-gray-50">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="p-2 rounded-md border border-gray-200 bg-gray-50">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="p-2 rounded-md border border-gray-200 bg-gray-50">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* キャンバスエリア */}
        <div 
          className="flex-1 overflow-hidden bg-gray-100 relative"
          onDrop={handleStageDrop}
          onDragOver={handleStageDragOver}
          style={{ height: `${FIXED_CANVAS_HEIGHT}px` }}
        >
          {/* ズームコントロール - 右上に配置 */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md border border-gray-200 p-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-50"
              title="ズームアウト"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 text-xs rounded text-gray-600 hover:bg-gray-50"
              title="リセット"
            >
              リセット
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-50"
              title="ズームイン"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full h-full">
            <Stage
              ref={stageRef}
              width={window.innerWidth < 1024 ? window.innerWidth - 32 : Math.max(CANVAS_WIDTH, window.innerWidth - 352)}
              height={FIXED_CANVAS_HEIGHT}
              onClick={handleStageClick}
              scaleX={scale}
              scaleY={scale}
              x={stagePosition.x}
              y={stagePosition.y}
              onWheel={handleWheel}
              draggable={false}
              onDragEnd={(e: any) => {
                setStagePosition({
                  x: e.target.x(),
                  y: e.target.y()
                });
              }}
              onMouseDown={(e: any) => {
                // 右クリックまたはCtrlキー+クリックでステージをドラッグ可能にする
                if (e.evt.button === 2 || e.evt.ctrlKey) {
                  e.target.draggable(true);
                } else {
                  e.target.draggable(false);
                }
              }}
              onMouseUp={(e: any) => {
                e.target.draggable(false);
              }}
            >
              <Layer>
                {/* デバッグ用: レイヤー情報を出力 */}
                {console.log('レイヤー描画中:', {
                  currentFloor: activeFloor,
                  elementsCount: currentFloor?.elements.length || 0,
                  elements: currentFloor?.elements,
                  scale,
                  stagePosition,
                  stageSize: {
                    width: window.innerWidth < 1024 ? window.innerWidth - 32 : Math.max(CANVAS_WIDTH, window.innerWidth - 352),
                    height: FIXED_CANVAS_HEIGHT
                  }
                })}
                {renderGrid()}
                {currentFloor?.elements.map(renderElement)}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* デスクトップ用: 右側パネル */}
        {selectedElement ? (
          <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedElement.type === 'wall' ? '壁' : 
                 selectedElement.type === 'door' ? 'ドア' : '窓'}の設定
              </h2>
              <button
                onClick={() => deleteElement(selectedElement.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 寸法設定 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">寸法</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      {selectedElement.type === 'wall' ? '厚み' : '幅'} (mm)
                    </label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'thickness')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'thickness', e.target.value)}
                      onBlur={(e) => handleInputBlur(selectedElement.id, 'thickness')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      step="50"
                      min="50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      {selectedElement.type === 'wall' ? '長さ' : '高さ'} (mm)
                    </label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'length')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'length', e.target.value)}
                      onBlur={(e) => handleInputBlur(selectedElement.id, 'length')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      step="50"
                      min="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">高さ (mm)</label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'height')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'height', e.target.value)}
                      onBlur={(e) => handleInputBlur(selectedElement.id, 'height')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      step="100"
                      min="1000"
                    />
                  </div>
                  
                  {/* 窓専用のFrom To高さ設定 */}
                  {selectedElement.type === 'window' && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">窓の高さ設定</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">床からの高さ (mm)</label>
                            <input
                              type="number"
                              value={getInputValue(selectedElement.id, 'heightFrom')}
                              onChange={(e) => handlePropertyInputChange(selectedElement.id, 'heightFrom', e.target.value)}
                              onBlur={(e) => handleInputBlur(selectedElement.id, 'heightFrom')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              step="50"
                              min="0"
                              max="2500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">上端の高さ (mm)</label>
                            <input
                              type="number"
                              value={getInputValue(selectedElement.id, 'heightTo')}
                              onChange={(e) => handlePropertyInputChange(selectedElement.id, 'heightTo', e.target.value)}
                              onBlur={(e) => handleInputBlur(selectedElement.id, 'heightTo')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              step="50"
                              min="100"
                              max="3000"
                            />
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            窓の実際の高さ: {
                              (parseInt(getInputValue(selectedElement.id, 'heightTo')) || 0) - 
                              (parseInt(getInputValue(selectedElement.id, 'heightFrom')) || 0)
                            }mm
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 回転設定 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">回転</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">角度 (度)</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="90"
                      value={selectedElement.rotation}
                      onChange={(e) => updateElementRotation(selectedElement.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {selectedElement.rotation}°
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 90, 180, 270].map((angle) => (
                      <button
                        key={angle}
                        onClick={() => updateElementRotation(selectedElement.id, angle)}
                        className={`px-2 py-1 text-xs rounded ${
                          selectedElement.rotation === angle
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {angle}°
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => rotateElement(selectedElement.id)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    90度回転
                  </button>
                </div>
              </div>

              {/* 材質設定 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">材質</h3>
                <select
                  value={selectedElement.properties.material || ''}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {selectedElement.type === 'wall' && (
                    <>
                      <option value="木造">木造</option>
                      <option value="鉄骨造">鉄骨造</option>
                      <option value="RC造">RC造</option>
                    </>
                  )}
                  {selectedElement.type === 'door' && (
                    <>
                      <option value="木製ドア">木製ドア</option>
                      <option value="アルミドア">アルミドア</option>
                      <option value="ガラスドア">ガラスドア</option>
                    </>
                  )}
                  {selectedElement.type === 'window' && (
                    <>
                      <option value="アルミサッシ">アルミサッシ</option>
                      <option value="樹脂サッシ">樹脂サッシ</option>
                      <option value="木製サッシ">木製サッシ</option>
                    </>
                  )}
                </select>
              </div>

              {/* 位置情報 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">位置情報</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>X: {pixelsToMm(selectedElement.x).toFixed(0)}mm</div>
                  <div>Y: {pixelsToMm(selectedElement.y).toFixed(0)}mm</div>
                  <div>幅: {pixelsToMm(selectedElement.width).toFixed(0)}mm</div>
                  <div>高: {pixelsToMm(selectedElement.height).toFixed(0)}mm</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6 flex-shrink-0">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">要素の詳細設定</h3>
              <p className="text-sm text-gray-600 mb-4">
                詳細な仕様を編集するには各要素をタップしてください
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• 壁、ドア、窓の寸法調整</div>
                <div>• 材質の選択</div>
                <div>• 回転角度の設定</div>
                <div>• 位置情報の確認</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* モバイル用: 下部パネル */}
      {selectedElement && (
        <div className="lg:hidden bg-white border-t border-gray-200 flex-shrink-0" style={{ height: selectedElement.type === 'window' ? '400px' : '300px' }}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedElement.type === 'wall' ? '壁' : 
                 selectedElement.type === 'door' ? 'ドア' : '窓'}の設定
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => deleteElement(selectedElement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedElement(null)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-lg leading-none">×</span>
                </button>
              </div>
            </div>

            {/* モバイル用コンパクトレイアウト */}
            <div className="space-y-4">
              {/* 寸法設定 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">寸法</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      {selectedElement.type === 'wall' ? '厚み' : '幅'} (mm)
                    </label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'thickness')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'thickness', e.target.value)}
                      onBlur={(e) => handleInputBlur(selectedElement.id, 'thickness')}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      step="50"
                      min="50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      {selectedElement.type === 'wall' ? '長さ' : '高さ'} (mm)
                    </label>
                    <input
                      type="number"
                      value={getInputValue(selectedElement.id, 'length')}
                      onChange={(e) => handlePropertyInputChange(selectedElement.id, 'length', e.target.value)}
                      onBlur={(e) => handleInputBlur(selectedElement.id, 'length')}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      step="50"
                      min="100"
                    />
                  </div>
                </div>
                
                {/* 窓専用のFrom To高さ設定（モバイル用） */}
                {selectedElement.type === 'window' && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">窓の高さ設定</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">床から (mm)</label>
                        <input
                          type="number"
                          value={getInputValue(selectedElement.id, 'heightFrom')}
                          onChange={(e) => handlePropertyInputChange(selectedElement.id, 'heightFrom', e.target.value)}
                          onBlur={(e) => handleInputBlur(selectedElement.id, 'heightFrom')}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          step="50"
                          min="0"
                          max="2500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">上端 (mm)</label>
                        <input
                          type="number"
                          value={getInputValue(selectedElement.id, 'heightTo')}
                          onChange={(e) => handlePropertyInputChange(selectedElement.id, 'heightTo', e.target.value)}
                          onBlur={(e) => handleInputBlur(selectedElement.id, 'heightTo')}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          step="50"
                          min="100"
                          max="3000"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                      実際の高さ: {
                        (parseInt(getInputValue(selectedElement.id, 'heightTo')) || 0) - 
                        (parseInt(getInputValue(selectedElement.id, 'heightFrom')) || 0)
                      }mm
                    </div>
                  </div>
                )}
              </div>

              {/* 回転設定 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">回転</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-1">
                    {[0, 90, 180, 270].map((angle) => (
                      <button
                        key={angle}
                        onClick={() => updateElementRotation(selectedElement.id, angle)}
                        className={`px-2 py-1 text-xs rounded ${
                          selectedElement.rotation === angle
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {angle}°
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => rotateElement(selectedElement.id)}
                    className="w-full flex items-center justify-center px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
                  >
                    <RotateCw className="w-3 h-3 mr-1" />
                    90度回転
                  </button>
                </div>
              </div>

              {/* 材質設定 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">材質</h3>
                <select
                  value={selectedElement.properties.material || ''}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'material', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {selectedElement.type === 'wall' && (
                    <>
                      <option value="木造">木造</option>
                      <option value="鉄骨造">鉄骨造</option>
                      <option value="RC造">RC造</option>
                    </>
                  )}
                  {selectedElement.type === 'door' && (
                    <>
                      <option value="木製ドア">木製ドア</option>
                      <option value="アルミドア">アルミドア</option>
                      <option value="ガラスドア">ガラスドア</option>
                    </>
                  )}
                  {selectedElement.type === 'window' && (
                    <>
                      <option value="アルミサッシ">アルミサッシ</option>
                      <option value="樹脂サッシ">樹脂サッシ</option>
                      <option value="木製サッシ">木製サッシ</option>
                    </>
                  )}
                </select>
              </div>

              {/* 位置情報 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">位置情報</h3>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                  <div>X: {pixelsToMm(selectedElement.x).toFixed(0)}mm</div>
                  <div>Y: {pixelsToMm(selectedElement.y).toFixed(0)}mm</div>
                  <div>幅: {pixelsToMm(selectedElement.width).toFixed(0)}mm</div>
                  <div>高: {pixelsToMm(selectedElement.height).toFixed(0)}mm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* モバイル用: 案内メッセージ */}
      {!selectedElement && (
        <div className="lg:hidden bg-white border-t border-gray-200 flex-shrink-0" style={{ height: '120px' }}>
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">要素の詳細設定</p>
              <p className="text-xs text-gray-500 mt-1">
                詳細な仕様を編集するには各要素をタップしてください
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanEditor; 