import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Step, StepGroup, UserNote, UserProgress } from '../types';
import { 
  fetchStepGroups, 
  fetchAllSteps, 
  fetchUserNotes, 
  fetchUserProgress,
  saveUserNote,
  updateUserProgress
} from '../api/sugorokuApi';

interface SugorokuContextType {
  // データ
  steps: Step[];
  stepGroups: StepGroup[];
  userNotes: UserNote[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  
  // 操作
  getCurrentStep: () => Step | undefined;
  getStepById: (id: number) => Step | undefined;
  getStepsByGroup: (groupId: number) => Step[];
  getNoteForStep: (stepId: number) => UserNote | undefined;
  markStepComplete: (stepId: number) => Promise<void>;
  markStepIncomplete: (stepId: number) => Promise<void>;
  saveNote: (stepId: number, content: string) => Promise<void>;
  moveToStep: (stepId: number) => Promise<void>;
}

const SugorokuContext = createContext<SugorokuContextType | undefined>(undefined);

interface SugorokuProviderProps {
  children: ReactNode;
  userId: string;
}

export const SugorokuProvider: React.FC<SugorokuProviderProps> = ({ children, userId }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepGroups, setStepGroups] = useState<StepGroup[]>([]);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [stepsData, groupsData, notesData, progressData] = await Promise.all([
          fetchAllSteps(),
          fetchStepGroups(),
          fetchUserNotes(userId),
          fetchUserProgress(userId)
        ]);
        
        setSteps(stepsData);
        setStepGroups(groupsData);
        setUserNotes(notesData);
        setUserProgress(progressData);
      } catch (err) {
        setError('データの読み込みに失敗しました');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [userId]);

  // ヘルパー関数
  const getCurrentStep = (): Step | undefined => {
    if (!userProgress) return undefined;
    return steps.find(step => step.id === userProgress.currentStep);
  };

  const getStepById = (id: number): Step | undefined => {
    return steps.find(step => step.id === id);
  };

  const getStepsByGroup = (groupId: number): Step[] => {
    return steps.filter(step => step.groupId === groupId).sort((a, b) => a.order - b.order);
  };

  const getNoteForStep = (stepId: number): UserNote | undefined => {
    return userNotes.find(note => note.stepId === stepId);
  };

  // 進捗管理
  const markStepComplete = async (stepId: number): Promise<void> => {
    if (!userProgress) return;
    
    try {
      setIsLoading(true);
      
      const completedSteps = userProgress.completedSteps.includes(stepId)
        ? userProgress.completedSteps
        : [...userProgress.completedSteps, stepId];
      
      const updatedProgress = await updateUserProgress(userId, { completedSteps });
      setUserProgress(updatedProgress);
    } catch (err) {
      setError('ステップの完了に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markStepIncomplete = async (stepId: number): Promise<void> => {
    if (!userProgress) return;
    
    try {
      setIsLoading(true);
      
      const completedSteps = userProgress.completedSteps.filter(id => id !== stepId);
      
      const updatedProgress = await updateUserProgress(userId, { completedSteps });
      setUserProgress(updatedProgress);
    } catch (err) {
      setError('ステップの未完了に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // メモの保存
  const saveNote = async (stepId: number, content: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const savedNote = await saveUserNote(userId, stepId, content);
      
      setUserNotes(prevNotes => {
        const index = prevNotes.findIndex(note => note.stepId === stepId);
        if (index >= 0) {
          const updatedNotes = [...prevNotes];
          updatedNotes[index] = savedNote;
          return updatedNotes;
        } else {
          return [...prevNotes, savedNote];
        }
      });
    } catch (err) {
      setError('メモの保存に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 現在のステップを変更
  const moveToStep = async (stepId: number): Promise<void> => {
    if (!userProgress) return;
    
    try {
      setIsLoading(true);
      
      const updatedProgress = await updateUserProgress(userId, { currentStep: stepId });
      setUserProgress(updatedProgress);
    } catch (err) {
      setError('ステップの移動に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    steps,
    stepGroups,
    userNotes,
    userProgress,
    isLoading,
    error,
    getCurrentStep,
    getStepById,
    getStepsByGroup,
    getNoteForStep,
    markStepComplete,
    markStepIncomplete,
    saveNote,
    moveToStep
  };

  return (
    <SugorokuContext.Provider value={value}>
      {children}
    </SugorokuContext.Provider>
  );
};

export const useSugoroku = (): SugorokuContextType => {
  const context = useContext(SugorokuContext);
  if (context === undefined) {
    throw new Error('useSugoroku must be used within a SugorokuProvider');
  }
  return context;
}; 