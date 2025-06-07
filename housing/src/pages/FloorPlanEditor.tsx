import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stage, Layer, Rect, Line, Circle, Text, Arc } from 'react-konva';
import { ArrowLeft, Save, ZoomIn, ZoomOut, RotateCw, Trash2, Grid, Move, Menu, X, Minus, Square, MousePointer, Plus, DoorOpen, Eye, Home, Bath, Car, Utensils, Armchair, BookOpen, Box, Package, RotateCcw } from 'lucide-react';
import type { KonvaEventObject } from '../types/konva';
import Konva from 'konva';
import { getDefaultLayout } from '../data/defaultLayouts';

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
    // 窓専用のFrom To高さ設定
    heightFrom?: number; // 床からの高さ (mm)
    heightTo?: number;   // 上端の高さ (mm)
    // ドア専用
    swingDirection?: 'left' | 'right' | 'inward' | 'outward';
    // 窓専用
    glassWidth?: number;
    windowType?: 'sliding' | 'casement' | 'fixed';
    glassType?: 'single' | 'double' | 'triple' | 'low-e';
    frameType?: 'aluminum' | 'wood' | 'vinyl' | 'composite';
    // キッチン専用
    hasStove?: boolean;
    hasSink?: boolean;
    // その他専用プロパティ
    capacity?: number;
    shelves?: number;
    hasDrawers?: boolean;
    hasArmrest?: boolean;
    // 汎用拡張フィールド
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

const FloorPlanEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyInfo: PropertyInfo = location.state?.propertyInfo;
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初期レイアウトの読み込み
  const getInitialElements = (): FloorElement[] => {
    // 常にシンプルなワンルームレイアウトを表示
    const defaultElements = getDefaultLayout('1R', 'detached_house');
    return defaultElements;
  };

  const [elements, setElements] = useState<FloorElement[]>(getInitialElements());
  const [selectedTool, setSelectedTool] = useState<'select' | 'wall' | 'door' | 'window' | 'kitchen' | 'bathtub' | 'toilet' | 'refrigerator' | 'washing_machine' | 'desk' | 'chair' | 'shelf'>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [scale, setScale] = useState(0.25); // 12000mm(1200px)がスマホ画面に収まるように調整
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 }); // 原点を左上(0,0)に設定
  const [gridVisible, setGridVisible] = useState(true);
  const [gridSize] = useState(10);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  
  // 入力フィールド専用の状態を追加
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});

  // プロパティパネルのスクロール設定を確実にする
  useEffect(() => {
    const scrollElement = document.querySelector('.property-scroll-container') as HTMLElement;
    if (scrollElement) {
      scrollElement.style.overflow = 'auto';
      scrollElement.style.overflowY = 'scroll';
      scrollElement.style.touchAction = 'auto';
      (scrollElement.style as any).webkitOverflowScrolling = 'touch';
    }
  }, [selectedElementId]);

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
  }, []);

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
  const addElement = (type: 'wall' | 'door' | 'window' | 'kitchen' | 'bathtub' | 'toilet' | 'refrigerator' | 'washing_machine' | 'desk' | 'chair' | 'shelf', position?: { x: number; y: number }) => {
    const newElement: FloorElement = {
      id: `${type}_${Date.now()}`,
      type,
      x: position ? pixelsToMm(position.x) : 1000, // mm単位で保存
      y: position ? pixelsToMm(position.y) : 1000, // mm単位で保存
      dimensions: {
        width: type === 'wall' ? 2000 : 
               type === 'door' ? 800 : 
               type === 'window' ? 1200 :
               type === 'kitchen' ? 2400 :
               type === 'bathtub' ? 1700 :
               type === 'toilet' ? 700 :
               type === 'refrigerator' ? 600 :
               type === 'washing_machine' ? 600 :
               type === 'desk' ? 1200 :
               type === 'chair' ? 450 :
               type === 'shelf' ? 800 : 800, // mm単位で保存
        depth: type === 'wall' ? 120 : // 壁の厚み: 120mm
               type === 'door' ? 35 : 
               type === 'window' ? 40 : // 窓の奥行き: 40mm
               type === 'kitchen' ? 600 :
               type === 'bathtub' ? 800 :
               type === 'toilet' ? 400 :
               type === 'refrigerator' ? 650 :
               type === 'washing_machine' ? 600 :
               type === 'desk' ? 700 :
               type === 'chair' ? 450 :
               type === 'shelf' ? 300 : 300,
        height: type === 'wall' ? 2400 : // 壁の高さ: 2400mm
                type === 'door' ? 2000 : 
                type === 'window' ? 1200 : // 窓の高さ: 1200mm
                type === 'kitchen' ? 850 :
                type === 'bathtub' ? 600 :
                type === 'toilet' ? 800 :
                type === 'refrigerator' ? 1800 :
                type === 'washing_machine' ? 1000 :
                type === 'desk' ? 720 :
                type === 'chair' ? 800 :
                type === 'shelf' ? 1800 : 1800
      },
      properties: {
        ...(type === 'wall' && {
          material: 'concrete'
        }),
        ...(type === 'door' && {
          material: 'wood',
          swingDirection: 'right'
        }),
        ...(type === 'window' && {
          heightFrom: 800, // 床からの高さ: 800mm
          glassWidth: 10, // ガラス幅: 10mm
          windowType: 'sliding',
          glassType: 'single'
        }),
        ...(type === 'kitchen' && {
          material: 'stainless_steel',
          hasStove: true,
          hasSink: true
        }),
        ...(type === 'bathtub' && {
          material: 'acrylic',
          capacity: 280
        }),
        ...(type === 'toilet' && {
          material: 'ceramic',
          type: 'western'
        }),
        ...(type === 'refrigerator' && {
          capacity: 400,
          type: 'double_door'
        }),
        ...(type === 'washing_machine' && {
          capacity: 8,
          type: 'front_loading'
        }),
        ...(type === 'desk' && {
          material: 'wood',
          hasDrawers: true
        }),
        ...(type === 'chair' && {
          material: 'fabric',
          hasArmrest: false
        }),
        ...(type === 'shelf' && {
          material: 'wood',
          shelves: 4
        })
      }
    };

    setElements(prev => [...prev, newElement]);
  };

  // ステージクリック処理
  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // より厳密な空のエリアクリック判定
    const clickedTarget = e.target;
    const stage = e.target.getStage();
    const isStageBackground = clickedTarget === stage || clickedTarget.getType() === 'Stage';
    
    // 要素やその装飾部分をクリックした場合は何もしない
    if (!isStageBackground) {
      console.log('Clicked on element or decoration, preserving selection'); // デバッグ用
      return;
    }
    
    console.log('Stage background clicked - clearing selection'); // デバッグ用
    setSelectedElementId(null);
    setInputValues({}); // 入力フィールドの状態をクリア
    
    // ツールが選択されている場合は要素を追加
    if (selectedTool !== 'select') {
      const pointerPosition = stage?.getPointerPosition();
      if (pointerPosition && stage) {
        const x = (pointerPosition.x - stagePos.x) / scale;
        const y = (pointerPosition.y - stagePos.y) / scale;
        addElement(selectedTool, { x, y });
        setSelectedTool('select');
      }
    }
  };

  // 要素クリック処理
  const handleElementClick = (element: FloorElement, e: KonvaEventObject<MouseEvent>) => {
    // イベント伝播を停止（但しpreventDefaultは削除）
    e.cancelBubble = true;
    e.evt.stopPropagation();
    e.evt.stopImmediatePropagation();
    
    console.log('Element clicked and selection set:', element.id, element.type); // デバッグ用
    
    // 即座に選択状態を設定（setTimeoutを使わない）
    setSelectedElementId(element.id);
    
    // 選択された要素のプロパティを入力フィールドの状態に設定
    const newInputValues: {[key: string]: string} = {};
    Object.keys(element.properties).forEach(key => {
      const value = element.properties[key];
      newInputValues[key] = value !== undefined ? String(value) : '';
    });
    // 基本的なサイズ・座標・高さ情報も追加
    newInputValues.elementX = String(element.x);
    newInputValues.elementY = String(element.y);
    newInputValues.elementWidth = String(element.dimensions.width);
    newInputValues.elementDepth = String(element.dimensions.depth);
    newInputValues.elementHeight = String(element.dimensions.depth);
    newInputValues.elementRealHeight = String(element.dimensions.height);
    setInputValues(newInputValues);
  };

  // 要素削除
  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElementId(null);
    setInputValues({}); // 入力フィールドの状態をクリア
  };

  // 要素回転
  const rotateElement = (elementId: string) => {
    setElements(prev => prev.map(el => {
      if (el.id === elementId) {
        // 90度右回り回転：width <-> depth を入れ替え
        const newWidth = el.dimensions.depth;
        const newDepth = el.dimensions.width;
        
        // 回転中心を要素の中心とした座標変換
        const centerX = el.x + el.dimensions.width / 2;
        const centerY = el.y + el.dimensions.depth / 2;
        
        // 新しい座標（回転後の左上角）
        const newX = centerX - newWidth / 2;
        const newY = centerY - newDepth / 2;
        
        const updatedElement = {
          ...el,
          x: newX,
          y: newY,
          dimensions: {
            ...el.dimensions,
            width: newWidth,
            depth: newDepth
          }
          // rotation プロパティは削除（実際の座標変換で対応）
        };

        // 回転後、選択状態と入力フィールドの値を更新
        if (elementId === selectedElementId) {
          const newInputValues: {[key: string]: string} = {};
          Object.keys(updatedElement.properties).forEach(key => {
            const value = updatedElement.properties[key];
            newInputValues[key] = value !== undefined ? String(value) : '';
          });
          newInputValues.elementX = String(updatedElement.x);
          newInputValues.elementY = String(updatedElement.y);
          newInputValues.elementWidth = String(updatedElement.dimensions.width);
          newInputValues.elementDepth = String(updatedElement.dimensions.depth);
          newInputValues.elementHeight = String(updatedElement.dimensions.depth);
          newInputValues.elementRealHeight = String(updatedElement.dimensions.height);
          setInputValues(newInputValues);
        }

        return updatedElement;
      }
      return el;
    }));
  };

  // 要素プロパティ更新
  const updateElementPropertyFixed = (property: string, value: any) => {
    if (!selectedElementId) return;

    // 入力フィールドの状態を更新
    setInputValues(prev => ({
      ...prev,
      [property]: value
    }));

    setElements(prev => prev.map(element => {
      if (element.id === selectedElementId) {
        const updatedElement = {
          ...element,
          properties: {
            ...element.properties,
            [property]: value
          }
        };

        // 基本的なサイズ・座標を更新
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue >= 0) {
          if (property === 'elementX') {
            updatedElement.x = numericValue;
          } else if (property === 'elementY') {
            updatedElement.y = numericValue;
          } else if (property === 'elementWidth') {
            updatedElement.dimensions.width = numericValue;
          } else if (property === 'elementHeight') {
            updatedElement.dimensions.depth = numericValue;
          } else if (property === 'elementDepth') {
            updatedElement.dimensions.depth = numericValue;
          } else if (property === 'elementRealHeight') {
            updatedElement.dimensions.height = numericValue;
          }
        }

        return updatedElement;
      }
      return element;
    }));
  };

  // 要素ドラッグ処理
  const handleElementDragMove = (elementId: string, e: KonvaEventObject<DragEvent>) => {
    const newX = snapToGrid(e.target.x());
    const newY = snapToGrid(e.target.y());
    
    e.target.x(newX);
    e.target.y(newY);

    const newXMm = pixelsToMm(newX);
    const newYMm = pixelsToMm(newY);

    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, x: newXMm, y: newYMm } : el
    ));

    // 選択された要素の場合、入力フィールドの座標値も更新
    if (elementId === selectedElementId) {
      setInputValues(prev => ({
        ...prev,
        elementX: String(newXMm),
        elementY: String(newYMm)
      }));
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
        case 'kitchen': return '#059669';
        case 'bathtub': return '#0891b2';
        case 'toilet': return '#7c3aed';
        case 'refrigerator': return '#dc2626';
        case 'washing_machine': return '#2563eb';
        case 'desk': return '#92400e';
        case 'chair': return '#b45309';
        case 'shelf': return '#374151';
        default: return '#6b7280';
      }
    };

    const getElementStroke = (type: string) => {
      switch (type) {
        case 'wall': return '#374151';
        case 'door': return '#92400e';
        case 'window': return '#1e40af';
        case 'kitchen': return '#047857';
        case 'bathtub': return '#0e7490';
        case 'toilet': return '#5b21b6';
        case 'refrigerator': return '#991b1b';
        case 'washing_machine': return '#1d4ed8';
        case 'desk': return '#78350f';
        case 'chair': return '#9a3412';
        case 'shelf': return '#1f2937';
        default: return '#374151';
      }
    };

    const handleElementClickLocal = (e: KonvaEventObject<MouseEvent>) => {
      // イベント伝播を停止（但しpreventDefaultは削除）
      e.cancelBubble = true;
      e.evt.stopPropagation();
      e.evt.stopImmediatePropagation();
      
      handleElementClick(element, e);
    };

    const handleElementTouchStart = (e: any) => {
      e.cancelBubble = true;
      e.evt.stopPropagation();
      e.evt.stopImmediatePropagation();
      
      console.log('Element touched and selection set:', element.id, element.type); // デバッグ用
      
      // 即座に選択状態を設定（setTimeoutを使わない）
      setSelectedElementId(element.id);
      
      // タッチ時も入力フィールドの状態を設定
      const newInputValues: {[key: string]: string} = {};
      Object.keys(element.properties).forEach(key => {
        const value = element.properties[key];
        newInputValues[key] = value !== undefined ? String(value) : '';
      });
      newInputValues.elementX = String(element.x);
      newInputValues.elementY = String(element.y);
      newInputValues.elementWidth = String(element.dimensions.width);
      newInputValues.elementDepth = String(element.dimensions.depth);
      newInputValues.elementHeight = String(element.dimensions.depth);
      newInputValues.elementRealHeight = String(element.dimensions.height);
      setInputValues(newInputValues);
    };

    // 要素のサイズを計算 - mm単位からピクセルに変換
    const elementWidth = mmToPixels(element.dimensions.width);  // x方向
    const elementHeight = mmToPixels(element.dimensions.depth); // y方向（平面図での奥行き）
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
          draggable={selectedTool === 'select'}
          onClick={handleElementClickLocal}
          onTouchStart={handleElementTouchStart}
          onDragMove={(e: any) => handleElementDragMove(element.id, e)}
        />
        
        {/* ドアの開き軌道を表示 */}
        {element.type === 'door' && (
          <Arc
            x={elementX}
            y={elementY}
            innerRadius={0}
            outerRadius={elementWidth}
            angle={90}
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
              listening={false}
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
              listening={false}
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
              listening={false}
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
              listening={false}
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
              listening={false}
            />
            <Circle
              x={elementX + elementWidth}
              y={elementY}
              radius={4}
              fill="#ef4444"
              listening={false}
            />
            <Circle
              x={elementX + elementWidth}
              y={elementY + elementHeight}
              radius={4}
              fill="#ef4444"
              listening={false}
            />
            <Circle
              x={elementX}
              y={elementY + elementHeight}
              radius={4}
              fill="#ef4444"
              listening={false}
            />
          </>
        )}
      </React.Fragment>
    );
  };

  const handleBack = () => {
    navigate('/property-info');
  };

  const handleSave = () => {
    console.log('保存中...', {
      elements,
      propertyInfo
    });
    
    // TODO: APIに保存処理を実装
    alert('間取りを保存しました');
  };

  const handleViewIsometric = () => {
    navigate('/isometric-view', {
      state: {
        floors: [{ id: '1', name: '1階', elements }],
        propertyInfo
      }
    });
  };

  const handleView3D = () => {
    navigate('/3d-view', {
      state: {
        floors: [{ id: '1', name: '1階', elements }],
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
    setScale(0.25); // 12000mm表示に最適化
    setStagePos({ x: 0, y: 0 }); // 原点を左上に戻す
  };

  const selectedElement = selectedElementId ? elements.find(el => el.id === selectedElementId) : null;

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

  // ツールの情報を定義
  const tools = [
    { type: 'select', label: '選択', icon: MousePointer },
    { type: 'wall', label: '壁', icon: Square },
    { type: 'door', label: 'ドア', icon: DoorOpen },
    { type: 'window', label: '窓', icon: Square },
    { type: 'kitchen', label: 'キッチン', icon: Utensils },
    { type: 'bathtub', label: '浴槽', icon: Bath },
    { type: 'toilet', label: 'トイレ', icon: Home },
    { type: 'refrigerator', label: '冷蔵庫', icon: Square },
    { type: 'washing_machine', label: '洗濯機', icon: Square },
    { type: 'desk', label: '机', icon: Square },
    { type: 'chair', label: '椅子', icon: Armchair },
    { type: 'shelf', label: '棚', icon: BookOpen }
  ];

  return (
    <div className="floor-plan-editor min-h-screen bg-gray-50 flex flex-col">
      {/* ツールバー（ヘッダーの下に固定） */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-[64px] z-20 shadow-sm">
        <div className="flex items-center justify-between">
          {/* ツールボタン */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto flex-1">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.type}
                  onClick={() => setSelectedTool(tool.type as any)}
                  className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center space-x-1 ${
                    selectedTool === tool.type
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* 右側のボタングループ */}
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            {/* グリッド切替 */}
            <button
              onClick={() => setGridVisible(!gridVisible)}
              className={`p-2 rounded-md transition-colors ${gridVisible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="グリッド表示切替"
            >
              <Grid className="h-4 w-4" />
            </button>
            
            {/* 3Dビューボタングループ */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleViewIsometric}
                className="p-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors"
                title="アイソメトリック図で表示（固定視点）"
              >
                <Package className="h-4 w-4" />
              </button>
              <button
                onClick={handleView3D}
                className="p-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                title="3Dビューで表示（自由視点・回転可能）"
              >
                <Box className="h-4 w-4" />
              </button>
            </div>
            
            {/* 保存ボタン */}
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* グリッドエリア */}
        <div 
          className="flex-1 bg-gray-100 overflow-hidden relative"
          ref={containerRef}
        >
          <div className="w-full h-full">
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
              draggable={true}
            >
              <Layer>
                {/* グリッド */}
                {renderGrid()}
                
                {/* 要素を描画 */}
                {elements.map((element) => renderElement(element))}
              </Layer>
            </Stage>
          </div>
          
          {/* ズームコントロール オーバーレイ */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex items-center space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-50 rounded text-gray-600 hover:text-gray-900 transition-colors"
              title="ズームアウト"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-2 hover:bg-gray-50 rounded text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors min-w-[60px]"
              title="ズームリセット"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-50 rounded text-gray-600 hover:text-gray-900 transition-colors"
              title="ズームイン"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* プロパティパネル（オーバーレイ表示） */}
          {selectedElement && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex flex-col shadow-2xl transform transition-transform duration-300 ease-out"
              style={{ height: '40vh', minHeight: '300px', maxHeight: '500px' }}
              onClick={(e) => {
                // プロパティパネル内でのクリックのみ伝播を防ぐ
                e.stopPropagation();
              }}
            >
              {/* パネルヘッダー */}
              <div className="px-4 py-3 border-b border-gray-200 bg-white/90 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Square className="h-3 w-3 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedElement.type === 'wall' && '壁のプロパティ'}
                      {selectedElement.type === 'door' && 'ドアのプロパティ'}
                      {selectedElement.type === 'window' && '窓のプロパティ'}
                      {selectedElement.type === 'kitchen' && 'キッチンのプロパティ'}
                      {selectedElement.type === 'bathtub' && '浴槽のプロパティ'}
                      {selectedElement.type === 'toilet' && 'トイレのプロパティ'}
                      {selectedElement.type === 'refrigerator' && '冷蔵庫のプロパティ'}
                      {selectedElement.type === 'washing_machine' && '洗濯機のプロパティ'}
                      {selectedElement.type === 'desk' && '机のプロパティ'}
                      {selectedElement.type === 'chair' && '椅子のプロパティ'}
                      {selectedElement.type === 'shelf' && '棚のプロパティ'}
                    </h3>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => rotateElement(selectedElementId!)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="90度回転"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteElement(selectedElementId!)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedElementId(null);
                        setInputValues({});
                      }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="閉じる"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* スクロール可能なパネル内容 */}
              <div 
                className="flex-1 p-2 overflow-auto property-scroll-container"
                style={{ 
                  height: 'calc(40vh - 80px)',
                  maxHeight: 'calc(40vh - 80px)',
                  minHeight: '220px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* 基本情報 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2">
                    <h4 className="text-xs font-semibold text-blue-900 mb-1 flex items-center">
                      <div className="w-3 h-3 bg-blue-200 rounded mr-1"></div>
                      基本情報
                    </h4>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-white rounded p-1">
                        <label className="block text-xs text-blue-700 font-medium mb-0.5">X (mm)</label>
                        <input
                          type="number"
                          value={inputValues.elementX || selectedElement.x || ''}
                          onChange={(e) => updateElementPropertyFixed('elementX', e.target.value)}
                          className="w-full text-xs font-bold text-blue-900 bg-transparent border-0 p-0 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="X座標"
                          step="10"
                        />
                      </div>
                      <div className="bg-white rounded p-1">
                        <label className="block text-xs text-blue-700 font-medium mb-0.5">Y (mm)</label>
                        <input
                          type="number"
                          value={inputValues.elementY || selectedElement.y || ''}
                          onChange={(e) => updateElementPropertyFixed('elementY', e.target.value)}
                          className="w-full text-xs font-bold text-blue-900 bg-transparent border-0 p-0 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="Y座標"
                          step="10"
                        />
                      </div>
                      <div className="bg-white rounded p-1">
                        <label className="block text-xs text-blue-700 font-medium mb-0.5">幅 (mm)</label>
                        <input
                          type="number"
                          value={inputValues.elementWidth || selectedElement.dimensions.width || ''}
                          onChange={(e) => updateElementPropertyFixed('elementWidth', e.target.value)}
                          className="w-full text-xs font-bold text-blue-900 bg-transparent border-0 p-0 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="幅"
                          min="10"
                          step="10"
                        />
                      </div>
                      <div className="bg-white rounded p-1">
                        <label className="block text-xs text-blue-700 font-medium mb-0.5">奥行 (mm)</label>
                        <input
                          type="number"
                          value={inputValues.elementDepth || selectedElement.dimensions.depth || ''}
                          onChange={(e) => updateElementPropertyFixed('elementDepth', e.target.value)}
                          className="w-full text-xs font-bold text-blue-900 bg-transparent border-0 p-0 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="奥行き"
                          min="10"
                          step="10"
                        />
                      </div>
                      <div className="bg-white rounded p-1 col-span-2">
                        <label className="block text-xs text-blue-700 font-medium mb-0.5">高さ (mm)</label>
                        <input
                          type="number"
                          value={inputValues.elementRealHeight || selectedElement.dimensions.height || ''}
                          onChange={(e) => updateElementPropertyFixed('elementRealHeight', e.target.value)}
                          className="w-full text-xs font-bold text-blue-900 bg-transparent border-0 p-0 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="高さ"
                          min="10"
                          step="10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 位置・座標編集 */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 border-b pb-1 mb-2">位置・座標</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">X座標 (mm)</label>
                        <input
                          type="number"
                          value={inputValues.elementX || selectedElement.x || ''}
                          onChange={(e) => updateElementPropertyFixed('elementX', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="X座標"
                          step="10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">Y座標 (mm)</label>
                        <input
                          type="number"
                          value={inputValues.elementY || selectedElement.y || ''}
                          onChange={(e) => updateElementPropertyFixed('elementY', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Y座標"
                          step="10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 詳細設定 */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 border-b pb-1 mb-2">詳細設定</h4>
                    <div className="space-y-2">
                      {selectedElement.type === 'wall' && (
                        <>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">材質</label>
                            <select
                              value={inputValues.material || selectedElement.properties.material || 'concrete'}
                              onChange={(e) => updateElementPropertyFixed('material', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="concrete">コンクリート</option>
                              <option value="wood">木造</option>
                              <option value="steel">鉄骨</option>
                              <option value="brick">レンガ</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">厚み (mm)</label>
                            <input
                              type="number"
                              value={inputValues.elementDepth || selectedElement.dimensions.depth || ''}
                              onChange={(e) => updateElementPropertyFixed('elementDepth', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="120"
                              min="50"
                              step="10"
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedElement.type === 'door' && (
                        <>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">開き方向</label>
                            <select
                              value={inputValues.swingDirection || selectedElement.properties.swingDirection || 'right'}
                              onChange={(e) => updateElementPropertyFixed('swingDirection', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="left">左開き</option>
                              <option value="right">右開き</option>
                              <option value="inward">内開き</option>
                              <option value="outward">外開き</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">材質</label>
                            <select
                              value={inputValues.material || selectedElement.properties.material || 'wood'}
                              onChange={(e) => updateElementPropertyFixed('material', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">床からの高さ (mm)</label>
                            <input
                              type="number"
                              value={inputValues.heightFrom || selectedElement.properties.heightFrom || ''}
                              onChange={(e) => updateElementPropertyFixed('heightFrom', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="800"
                              min="0"
                              step="50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">ガラスタイプ</label>
                            <select
                              value={inputValues.glassType || selectedElement.properties.glassType || 'single'}
                              onChange={(e) => updateElementPropertyFixed('glassType', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="single">単板ガラス</option>
                              <option value="double">複層ガラス</option>
                              <option value="triple">三層ガラス</option>
                              <option value="low-e">Low-Eガラス</option>
                            </select>
                          </div>
                        </>
                      )}

                      {selectedElement.type === 'kitchen' && (
                        <>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">材質</label>
                            <select
                              value={inputValues.material || selectedElement.properties.material || 'stainless_steel'}
                              onChange={(e) => updateElementPropertyFixed('material', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="stainless_steel">ステンレス</option>
                              <option value="artificial_marble">人工大理石</option>
                              <option value="wood">木材</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">機能</label>
                            <div className="flex space-x-3">
                              <label className="flex items-center text-xs">
                                <input
                                  type="checkbox"
                                  checked={inputValues.hasStove === 'true' || selectedElement.properties.hasStove === true}
                                  onChange={(e) => updateElementPropertyFixed('hasStove', e.target.checked ? 'true' : 'false')}
                                  className="mr-1 w-3 h-3"
                                />
                                コンロ
                              </label>
                              <label className="flex items-center text-xs">
                                <input
                                  type="checkbox"
                                  checked={inputValues.hasSink === 'true' || selectedElement.properties.hasSink === true}
                                  onChange={(e) => updateElementPropertyFixed('hasSink', e.target.checked ? 'true' : 'false')}
                                  className="mr-1 w-3 h-3"
                                />
                                シンク
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                      {/* その他の要素タイプ用の基本設定 */}
                      {!['wall', 'door', 'window', 'kitchen'].includes(selectedElement.type) && (
                        <>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">色</label>
                            <select
                              value={inputValues.color || 'default'}
                              onChange={(e) => updateElementPropertyFixed('color', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="default">デフォルト</option>
                              <option value="white">白</option>
                              <option value="gray">グレー</option>
                              <option value="brown">茶色</option>
                              <option value="black">黒</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">材質</label>
                            <select
                              value={inputValues.material || selectedElement.properties.material || 'wood'}
                              onChange={(e) => updateElementPropertyFixed('material', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="wood">木材</option>
                              <option value="metal">金属</option>
                              <option value="plastic">プラスチック</option>
                              <option value="fabric">布製</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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