declare module 'konva' {
  export class Konva {
    static Stage: any;
    static Layer: any;
    static Rect: any;
    static Line: any;
    static Circle: any;
    static Text: any;
  }
}

declare module 'konva/lib/Node' {
  export interface KonvaEventObject<EventType = Event, NodeType = any> {
    target: NodeType & {
      getStage(): any;
      position(): { x: number; y: number };
      getClassName(): string;
    };
    evt: EventType;
    cancelBubble: boolean;
  }
}

declare module 'react-konva' {
  import { ComponentType } from 'react';
  
  export const Stage: ComponentType<any>;
  export const Layer: ComponentType<any>;
  export const Rect: ComponentType<any>;
  export const Line: ComponentType<any>;
  export const Circle: ComponentType<any>;
  export const Text: ComponentType<any>;
}

import { KonvaEventObject as OriginalKonvaEventObject } from 'konva/lib/Node';

export type KonvaEventObject<T = Event> = OriginalKonvaEventObject<T>; 