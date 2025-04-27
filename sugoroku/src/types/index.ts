export interface Step {
  id: number;
  title: string;
  titleImage: string;
  detailImage: string;
  category: string;
  phase: Phase;
}

export interface UserStep extends Step {
  isCompleted: boolean;
  notes: string;
}

export type ViewMode = 'timeline' | 'grid' | 'boardGame' | 'mypage';

export type Phase = 
  | '計画'
  | '発注'
  | '設計'
  | '施工'
  | '完成・引き渡し';

export const ALL_PHASES: Phase[] = [
  '計画',
  '発注',
  '設計',
  '施工',
  '完成・引き渡し'
];