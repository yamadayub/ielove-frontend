import React, { createContext, useContext, useState, useEffect } from 'react';
import { ViewMode } from '../types';
import { Phase, ALL_PHASES } from '../types/sugoroku';
import { sugorokuApi } from '../api/sugorokuApi';
import { UserStep } from '../types/sugoroku';
import { ClerkLoaded, useUser } from '@clerk/clerk-react';

interface StepContextType {
  steps: UserStep[];
  currentStep: UserStep | null;
  viewMode: ViewMode;
  currentPhase: Phase | 'all';
  progressPercentage: number;
  loading: boolean;
  error: string | null;
  setSteps: (steps: UserStep[]) => void;
  setCurrentStep: (step: UserStep | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentPhase: (phase: Phase | 'all') => void;
  toggleStepComplete: (id: number) => Promise<void>;
  updateStepNotes: (id: number, notes: string) => Promise<void>;
  getCompletedStepsCount: () => number;
  getFilteredSteps: () => UserStep[];
  refreshSteps: () => Promise<void>;
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
  const [steps, setSteps] = useState<UserStep[]>([]);
  const [currentStep, setCurrentStep] = useState<UserStep | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('boardGame');
  const [currentPhase, setCurrentPhase] = useState<Phase | 'all'>('all');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useUser();

  // ステップデータを読み込む
  const fetchSteps = async () => {
    try {
      setLoading(true);
      setError(null);

      // バックエンドAPIが利用できない場合のモックデータ
      const mockSteps = [
        {
          id: 1,
          title: "Step 1: 家族のライフスタイルを整理する",
          description: "住む人の生活パターンや好み、将来の変化を考えます。",
          phase: "計画" as Phase,
          order_index: 1,
          group_id: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          images: [],
          like_count: 0
        },
        {
          id: 2,
          title: "Step 2: 予算を決める",
          description: "建設費、諸費用、維持費を含めた総予算を検討します。",
          phase: "計画" as Phase,
          order_index: 2,
          group_id: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          images: [],
          like_count: 0
        },
        {
          id: 3,
          title: "Step 3: 土地を探す・決める",
          description: "立地、法的制限、インフラを確認して土地を選びます。",
          phase: "計画" as Phase,
          order_index: 3,
          group_id: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          images: [],
          like_count: 0
        },
        {
          id: 4,
          title: "Step 4: 建築会社を選ぶ",
          description: "実績、対応力、コストパフォーマンスを比較検討します。",
          phase: "発注" as Phase,
          order_index: 4,
          group_id: 2,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          images: [],
          like_count: 0
        },
        {
          id: 5,
          title: "Step 5: 間取りを決める",
          description: "生活動線、部屋の配置、収納計画を具体化します。",
          phase: "設計" as Phase,
          order_index: 5,
          group_id: 3,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          images: [],
          like_count: 0
        }
      ];

      try {
        if (isSignedIn) {
          // 認証済みの場合はユーザー固有のステップデータを取得を試行
          const response = await sugorokuApi.getUserSteps();
          console.log('認証済みユーザーのステップデータ:', response.data);
          setSteps(response.data);

          // 進捗情報も取得
          const progressResponse = await sugorokuApi.getTotalProgress();
          setProgressPercentage(progressResponse.data.progress);
        } else {
          // 未認証の場合は公開ステップのみ取得を試行
          const response = await sugorokuApi.getSteps();
          console.log('未認証ユーザーの公開ステップデータ:', response.data);
          
          // APIレスポンスの形式に対応
          let stepsData: any[] = [];
          if (Array.isArray(response.data)) {
            stepsData = response.data;
          } else if (response.data && typeof response.data === 'object') {
            // オブジェクトの場合は適切なプロパティを探す
            const data = response.data as Record<string, any>;
            if ('items' in data && Array.isArray(data.items)) {
              stepsData = data.items;
            } else if ('results' in data && Array.isArray(data.results)) {
              stepsData = data.results;
            } else {
              // オブジェクト自体が1つのステップデータの場合
              stepsData = [data];
            }
          }
          
          console.log('処理用ステップデータ:', stepsData);
          
          // ステップをUserStep形式に変換（isCompletedとnotesを追加）
          const publicSteps: UserStep[] = stepsData.map((step: any) => ({
            id: 0, // ダミーID
            user_id: 0, // ダミーユーザーID
            step_id: step.id,
            is_completed: false,
            completed_at: null,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: null,
            step: step
          }));
          setSteps(publicSteps);
          
          // 未認証ではプログレスは0
          setProgressPercentage(0);
        }
      } catch (apiError) {
        console.warn('API接続に失敗しました。モックデータを使用します:', apiError);
        
        // APIが失敗した場合はモックデータを使用
        const mockUserSteps: UserStep[] = mockSteps.map((step, index) => ({
          id: index + 1,
          user_id: isSignedIn ? 1 : 0,
          step_id: step.id,
          is_completed: index < 2, // 最初の2つのステップを完了済みとする
          completed_at: index < 2 ? new Date().toISOString() : null,
          notes: index === 0 ? "家族で話し合いました" : null,
          created_at: new Date().toISOString(),
          updated_at: null,
          step: step
        }));
        
        setSteps(mockUserSteps);
        setProgressPercentage(isSignedIn ? 40 : 0); // 認証済みの場合は40%の進捗
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch steps:', err);
      setError('ステップデータの取得に失敗しました');
      setLoading(false);
    }
  };

  // 初回ロード時にデータを取得
  useEffect(() => {
    fetchSteps();
  }, [isSignedIn]); // ログイン状態が変わったときも再取得

  // 手動更新用のメソッド
  const refreshSteps = async () => {
    await fetchSteps();
  };

  // ステップの完了状態を切り替え
  const toggleStepComplete = async (stepId: number) => {
    if (!isSignedIn) {
      console.warn('認証が必要です: ステップの完了状態を変更するにはログインしてください');
      return;
    }

    try {
      const response = await sugorokuApi.toggleStepComplete(stepId);
      
      // ステップ配列を更新
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.step_id === stepId ? response.data : step
        )
      );
      
      // 現在選択されているステップも更新
      if (currentStep && currentStep.step_id === stepId) {
        setCurrentStep(response.data);
      }
      
      // 進捗の更新
      const progressResponse = await sugorokuApi.getTotalProgress();
      setProgressPercentage(progressResponse.data.progress);
    } catch (err) {
      console.error('Failed to toggle step completion:', err);
      throw new Error('ステップの完了状態の更新に失敗しました');
    }
  };

  // ステップのメモを更新
  const updateStepNotes = async (stepId: number, notes: string) => {
    if (!isSignedIn) {
      console.warn('認証が必要です: メモを更新するにはログインしてください');
      return;
    }

    try {
      const response = await sugorokuApi.updateStepNotes(stepId, notes);
      
      // ステップ配列を更新
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.step_id === stepId ? response.data : step
        )
      );
      
      // 現在選択されているステップも更新
      if (currentStep && currentStep.step_id === stepId) {
        setCurrentStep(response.data);
      }
    } catch (err) {
      console.error('Failed to update step notes:', err);
      throw new Error('メモの更新に失敗しました');
    }
  };

  // 完了ステップの数を取得
  const getCompletedStepsCount = () => {
    return steps.filter(step => step.is_completed).length;
  };

  // 現在のフェーズでフィルターしたステップを取得
  const getFilteredSteps = () => {
    if (currentPhase === 'all') return steps;
    return steps.filter(step => step.step.phase === currentPhase);
  };

  return (
    <StepContext.Provider 
      value={{
        steps,
        currentStep,
        viewMode,
        currentPhase,
        progressPercentage,
        loading,
        error,
        setSteps,
        setCurrentStep,
        setViewMode,
        setCurrentPhase,
        toggleStepComplete,
        updateStepNotes,
        getCompletedStepsCount,
        getFilteredSteps,
        refreshSteps
      }}
    >
      {children}
    </StepContext.Provider>
  );
};