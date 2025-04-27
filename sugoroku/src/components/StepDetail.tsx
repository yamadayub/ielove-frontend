import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Save } from 'lucide-react';
import { useStepContext } from '../contexts/StepContext';

const StepDetail: React.FC = () => {
  const { currentStep, setCurrentStep, toggleStepComplete, updateStepNotes } = useStepContext();
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'detail' | 'notes'>('detail');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentStep) {
      setNotes(currentStep.notes);
      setIsSaved(false);
    }
  }, [currentStep]);

  if (!currentStep) return null;

  const handleClose = () => {
    setCurrentStep(null);
  };

  const handleToggleComplete = () => {
    if (currentStep) {
      toggleStepComplete(currentStep.id);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsSaved(false);
  };

  const handleSaveNotes = () => {
    if (currentStep) {
      updateStepNotes(currentStep.id, notes);
      setIsSaved(true);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="relative">
          <img 
            src={activeTab === 'detail' ? currentStep.detailImage : currentStep.titleImage}
            alt={currentStep.title}
            className="w-full h-48 sm:h-64 object-cover"
          />
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
            aria-label="閉じる"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">
              Step {currentStep.id}: {currentStep.title}
            </h2>
            <button
              onClick={handleToggleComplete}
              className={`p-2 rounded-full transition-colors ${
                currentStep.isCompleted 
                  ? 'bg-primary text-white' 
                  : 'bg-primary-lighter text-primary-light hover:bg-primary-lighter/70'
              }`}
              aria-label={currentStep.isCompleted ? "完了を解除" : "完了としてマーク"}
            >
              <CheckCircle size={20} />
            </button>
          </div>
          <p className="text-primary text-sm font-medium mt-1">{currentStep.category}</p>
        </div>
        
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-4 py-2 font-medium text-sm flex-1 ${
                activeTab === 'detail' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-primary-light hover:text-primary'
              }`}
              onClick={() => setActiveTab('detail')}
            >
              詳細情報
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex-1 ${
                activeTab === 'notes' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-primary-light hover:text-primary'
              }`}
              onClick={() => setActiveTab('notes')}
            >
              自分のメモ
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {activeTab === 'detail' ? (
            <div className="p-4">
              <h3 className="font-semibold mb-3 text-primary">考えるポイント</h3>
              <p className="text-primary-light">
                このステップでは、{currentStep.title}についてじっくり考えましょう。
                家づくりの第一歩として、理想の暮らしをイメージし、家族全員の希望をまとめることが重要です。
                予算や土地、間取りなど、様々な要素を総合的に検討していきましょう。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="bg-primary-lighter text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</span>
                  <span className="text-primary-light">家族構成を確認し、それぞれの希望をリストアップしましょう</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-lighter text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</span>
                  <span className="text-primary-light">将来の変化も考慮に入れて、長期的な視点で検討しましょう</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-lighter text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</span>
                  <span className="text-primary-light">優先順位をつけて、譲れない条件と妥協できる条件を整理しましょう</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="p-4 h-full flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-primary">あなたのメモ</h3>
                <div className="flex items-center">
                  {isSaved && (
                    <span className="text-primary text-xs mr-2 animate-fadeIn">
                      保存しました
                    </span>
                  )}
                  <button
                    onClick={handleSaveNotes}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors"
                  >
                    <Save size={16} className="mr-1" />
                    保存
                  </button>
                </div>
              </div>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="このステップについてのメモを入力してください..."
                className="flex-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-lighter focus:border-primary resize-none text-primary-light"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepDetail;