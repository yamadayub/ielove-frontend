export interface Step {
  id: number;
  title: string;
  description: string;
  images: string[];
  groupId: number;
  order: number;
}

export interface StepGroup {
  id: number;
  name: string;
  description: string;
  color: string;
  order: number;
}

export interface UserNote {
  stepId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: string;
  completedSteps: number[];
  currentStep: number;
  lastUpdated: string;
}

export interface DeepLinkParams {
  stepId?: number;
  groupId?: number;
} 