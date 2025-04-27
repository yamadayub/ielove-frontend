import React from 'react';
import { useStepContext } from '../contexts/StepContext';
import { FileText, Eye } from 'lucide-react';

const NotesView: React.FC = () => {
  const { steps, setCurrentStep } = useStepContext();
  
  const stepsWithNotes = steps.filter(step => step.notes && step.notes.trim() !== '');
  
  if (stepsWithNotes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-primary-lighter/20 rounded-lg p-8 max-w-md mx-auto">
          <FileText size={48} className="mx-auto text-primary-light mb-4" />
          <h3 className="text-xl font-medium text-primary mb-2">メモがありません</h3>
          <p className="text-primary-light">
            各ステップを開いて、あなたの検討結果をメモしておくと、ここで一覧できます。
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-primary mb-4">あなたのメモ一覧</h2>
      <div className="space-y-4">
        {stepsWithNotes.map(step => (
          <div key={step.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-primary">
                  Step {step.id}: {step.title}
                </h3>
                <p className="text-primary-light text-sm mt-1">{step.category}</p>
              </div>
              <button
                onClick={() => setCurrentStep(step)}
                className="bg-primary-lighter hover:bg-primary-lighter/70 text-primary p-2 rounded-full transition-colors"
                aria-label="メモを見る"
              >
                <Eye size={18} />
              </button>
            </div>
            <div className="mt-3 p-3 bg-primary-lighter/20 rounded-md text-primary-light text-sm">
              {step.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;