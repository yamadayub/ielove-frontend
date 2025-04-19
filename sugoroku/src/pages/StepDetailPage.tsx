import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { Button } from '../components/ui/Button';

export const StepDetailPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const numericStepId = stepId ? parseInt(stepId, 10) : null;
  
  const {
    steps,
    stepGroups,
    userNotes,
    userProgress,
    isLoading,
    error,
    getStepById,
    getNoteForStep,
    markStepComplete,
    markStepIncomplete,
    saveNote,
    getStepsByGroup,
  } = useSugoroku();

  // ノートエディタの状態
  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 現在のステップと関連情報
  const step = numericStepId ? getStepById(numericStepId) : undefined;
  const group = step ? stepGroups.find(g => g.id === step.groupId) : undefined;
  const note = step ? getNoteForStep(step.id) : undefined;
  const isCompleted = step ? userProgress?.completedSteps.includes(step.id) || false : false;

  // 同じグループの他のステップ（関連ステップ）
  const relatedSteps = step ? 
    getStepsByGroup(step.groupId).filter(s => s.id !== step.id).slice(0, 4) 
    : [];

  // ノートの初期値を設定
  useEffect(() => {
    if (note) {
      setNoteContent(note.content);
    } else {
      setNoteContent('');
    }
  }, [note]);

  // ノート保存処理
  const handleSaveNote = async () => {
    if (!step) return;
    
    await saveNote(step.id, noteContent);
    setIsEditingNote(false);
  };

  // ステップの完了/未完了の切り替え
  const handleToggleComplete = async () => {
    if (!step) return;
    
    if (isCompleted) {
      await markStepIncomplete(step.id);
    } else {
      await markStepComplete(step.id);
    }
  };

  // グリッドビューに戻る
  const handleBackToGrid = () => {
    navigate('/grid');
  };

  // スゴロクビューに移動
  const handleGoToSugoroku = () => {
    if (step) {
      navigate(`/`);
      // 少し遅延させてからステップをフォーカス
      setTimeout(() => {
        navigate(`/step/${step.id}`);
      }, 100);
    }
  };

  // 前後のステップを取得
  const prevStep = step ? steps.find(s => s.order === step.order - 1) : undefined;
  const nextStep = step ? steps.find(s => s.order === step.order + 1) : undefined;

  // 前のステップに移動
  const handlePrevStep = () => {
    if (prevStep) {
      navigate(`/step-detail/${prevStep.id}`);
    }
  };

  // 次のステップに移動
  const handleNextStep = () => {
    if (nextStep) {
      navigate(`/step-detail/${nextStep.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-14 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !step || !group) {
    return (
      <div className="min-h-screen pt-16 pb-14 px-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error || 'ステップが見つかりませんでした'}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/grid')}
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-14 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 上部ナビゲーション */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button onClick={handleBackToGrid} className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">ステップ {step.order}: {step.title}</h1>
          </div>
          <Button onClick={handleGoToSugoroku} variant="secondary" size="sm">
            スゴロクで見る
          </Button>
        </div>

        {/* メインカード */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* グループカラーバー */}
          <div className="h-2" style={{ backgroundColor: group.color }}></div>
          
          {/* ステップ情報ヘッダー */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{group.name}</p>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-800 text-sm font-medium">
                {step.order}
              </span>
            </div>
          </div>
          
          {/* 画像表示エリア */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 bg-gray-100">
              <img
                src={step.images[activeImageIndex]}
                alt={`${step.title} - 画像 ${activeImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* 画像切り替えボタン */}
            {step.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full px-2 py-1 text-white text-xs">
                {step.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`mx-1 w-2 h-2 rounded-full ${
                      activeImageIndex === index ? 'bg-white' : 'bg-gray-400'
                    }`}
                  ></button>
                ))}
              </div>
            )}
          </div>
          
          {/* 説明文 */}
          <div className="p-4">
            <p className="text-gray-800 whitespace-pre-wrap mb-4">
              {step.description}
            </p>
            
            {/* 完了ボタン */}
            <Button
              variant={isCompleted ? 'secondary' : 'primary'}
              size="md"
              onClick={handleToggleComplete}
              isFullWidth
              className="mb-4"
            >
              {isCompleted ? '完了を取り消す' : 'このステップを完了する'}
            </Button>
            
            {/* 前後のステップナビゲーション */}
            <div className="flex justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={!prevStep}
              >
                前のステップ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStep}
                disabled={!nextStep}
              >
                次のステップ
              </Button>
            </div>
          </div>
        </div>
        
        {/* メモセクション */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">メモ</h3>
              {note && !isEditingNote && (
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => setIsEditingNote(true)}
                >
                  編集
                </Button>
              )}
            </div>
          </div>
          
          <div className="p-4">
            {isEditingNote || !note ? (
              <>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="このステップについてメモを残しましょう..."
                  className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <div className="flex justify-end mt-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingNote(false);
                      setNoteContent(note?.content || '');
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNote}
                  >
                    保存
                  </Button>
                </div>
              </>
            ) : note ? (
              <div className="whitespace-pre-wrap">
                {note.content}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-2">メモはまだありません</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingNote(true)}
                >
                  メモを追加
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* 関連ステップ */}
        {relatedSteps.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">同じフェーズのステップ</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4">
              {relatedSteps.map(relatedStep => (
                <div
                  key={relatedStep.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/step-detail/${relatedStep.id}`)}
                >
                  <div className="relative aspect-square mb-1">
                    <img
                      src={relatedStep.images[0]}
                      alt={relatedStep.title}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                      {relatedStep.order}
                    </div>
                  </div>
                  <p className="text-xs truncate">{relatedStep.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 