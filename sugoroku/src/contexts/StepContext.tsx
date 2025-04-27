import React, { createContext, useContext, useState, useEffect } from 'react';
import { Step, UserStep, ViewMode, Phase, ALL_PHASES } from '../types';
import { generateAllSteps } from '../data/sampleSteps';

interface StepContextType {
  steps: UserStep[];
  currentStep: UserStep | null;
  viewMode: ViewMode;
  currentPhase: Phase | 'all';
  progressPercentage: number;
  setCurrentStep: (step: UserStep | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentPhase: (phase: Phase | 'all') => void;
  toggleStepComplete: (id: number) => void;
  updateStepNotes: (id: number, notes: string) => void;
  getCompletedStepsCount: () => number;
  getFilteredSteps: () => UserStep[];
}

const StepContext = createContext<StepContextType | undefined>(undefined);

export const useStepContext = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStepContext must be used within a StepProvider');
  }
  return context;
};

export const StepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSteps: UserStep[] = generateAllSteps().map((step: Step): UserStep => ({
    ...step,
    isCompleted: false,
    notes: '',
  }));

  const loadStepsFromStorage = (): UserStep[] => {
    const savedSteps = localStorage.getItem('houseSteps');
    if (savedSteps) {
      try {
        return JSON.parse(savedSteps);
      } catch (e) {
        console.error('Failed to parse saved steps', e);
      }
    }
    return initialSteps;
  };

  const [steps, setSteps] = useState<UserStep[]>(loadStepsFromStorage);
  const [currentStep, setCurrentStep] = useState<UserStep | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('boardGame');
  const [currentPhase, setCurrentPhase] = useState<Phase | 'all'>('all');

  useEffect(() => {
    localStorage.setItem('houseSteps', JSON.stringify(steps));
  }, [steps]);

  const toggleStepComplete = (id: number) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
      )
    );

    if (currentStep && currentStep.id === id) {
      setCurrentStep({ ...currentStep, isCompleted: !currentStep.isCompleted });
    }
  };

  const updateStepNotes = (id: number, notes: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === id ? { ...step, notes } : step
      )
    );

    if (currentStep && currentStep.id === id) {
      setCurrentStep({ ...currentStep, notes });
    }
  };

  const getCompletedStepsCount = () => {
    return steps.filter(step => step.isCompleted).length;
  };

  const getFilteredSteps = () => {
    if (currentPhase === 'all') return steps;
    return steps.filter(step => step.phase === currentPhase);
  };

  const progressPercentage = (getCompletedStepsCount() / steps.length) * 100;

  return (
    <StepContext.Provider 
      value={{
        steps,
        currentStep,
        viewMode,
        currentPhase,
        progressPercentage,
        setCurrentStep,
        setViewMode,
        setCurrentPhase,
        toggleStepComplete,
        updateStepNotes,
        getCompletedStepsCount,
        getFilteredSteps
      }}
    >
      {children}
    </StepContext.Provider>
  );
};