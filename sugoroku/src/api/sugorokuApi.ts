import { Step, StepGroup, UserNote, UserProgress } from '../types';
import { mockStepGroups, mockSteps, mockUserNotes, mockUserProgress } from './mockData';

// 全てのステップグループを取得
export const fetchStepGroups = async (): Promise<StepGroup[]> => {
  // 実際のAPIが完成したら、ここをfetchに置き換える
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockStepGroups);
    }, 500);
  });
};

// 全てのステップを取得
export const fetchAllSteps = async (): Promise<Step[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockSteps);
    }, 500);
  });
};

// 特定のグループに属するステップを取得
export const fetchStepsByGroup = async (groupId: number): Promise<Step[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const filteredSteps = mockSteps.filter(step => step.groupId === groupId);
      resolve(filteredSteps);
    }, 500);
  });
};

// 特定のステップを取得
export const fetchStepById = async (stepId: number): Promise<Step | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const step = mockSteps.find(s => s.id === stepId);
      resolve(step || null);
    }, 500);
  });
};

// ユーザーのノートを取得
export const fetchUserNotes = async (userId: string): Promise<UserNote[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockUserNotes);
    }, 500);
  });
};

// ステップに対するノートを追加/更新
export const saveUserNote = async (userId: string, stepId: number, content: string): Promise<UserNote> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const existingNoteIndex = mockUserNotes.findIndex(note => note.stepId === stepId);
      
      let updatedNote: UserNote;
      
      if (existingNoteIndex >= 0) {
        updatedNote = {
          ...mockUserNotes[existingNoteIndex],
          content,
          updatedAt: now
        };
        mockUserNotes[existingNoteIndex] = updatedNote;
      } else {
        updatedNote = {
          stepId,
          content,
          createdAt: now,
          updatedAt: now
        };
        mockUserNotes.push(updatedNote);
      }
      
      resolve(updatedNote);
    }, 500);
  });
};

// ユーザーの進捗状況を取得
export const fetchUserProgress = async (userId: string): Promise<UserProgress> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockUserProgress);
    }, 500);
  });
};

// ユーザーの進捗状況を更新
export const updateUserProgress = async (
  userId: string, 
  updates: Partial<UserProgress>
): Promise<UserProgress> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const updatedProgress = {
        ...mockUserProgress,
        ...updates,
        lastUpdated: now
      };
      
      // 実際のアプリでは、ここでデータを保存する処理を行う
      
      resolve(updatedProgress);
    }, 500);
  });
}; 