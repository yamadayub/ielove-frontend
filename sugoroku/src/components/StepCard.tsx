import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle, FileText } from 'lucide-react';
import { UserStep } from '../types';
import { useStepContext } from '../contexts/StepContext';

interface StepCardProps {
  step: UserStep;
  mode?: 'compact' | 'full';
}

const StepCard: React.FC<StepCardProps> = ({ step, mode = 'full' }) => {
  const { toggleStepComplete } = useStepContext();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/steps/${step.id}`);
  };

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStepComplete(step.id);
  };

  if (mode === 'compact') {
    return (
      <div 
        className={`aspect-square cursor-pointer ${
          step.isCompleted ? 'ring-1 ring-primary' : ''
        }`}
        onClick={handleCardClick}
      >
        <div className="relative h-full">
          <img 
            src={step.titleImage} 
            alt={step.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
            <div className="p-2 text-white w-full">
              <p className="text-xs font-medium truncate">Step {step.id}</p>
            </div>
          </div>
          {step.isCompleted && (
            <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
              <Check size={12} className="text-white" />
            </div>
          )}
          {step.notes && (
            <div className="absolute top-1 left-1 bg-primary-light rounded-full p-0.5">
              <FileText size={12} className="text-white" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer ${
        step.isCompleted ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={step.titleImage} 
          alt={step.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary-lighter/90 text-primary px-2 py-1 rounded-full text-xs font-medium">
          Step {step.id}
        </div>
        <button
          className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
            step.isCompleted 
              ? 'bg-primary text-white' 
              : 'bg-white/80 text-primary-light hover:bg-primary-lighter'
          }`}
          onClick={handleCheckClick}
          aria-label={step.isCompleted ? "マーク解除" : "完了としてマーク"}
        >
          <CheckCircle size={20} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-primary mb-2">{step.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary-light bg-primary-lighter px-2 py-1 rounded-full">
            {step.category}
          </span>
          {step.notes && (
            <span className="flex items-center text-xs text-primary">
              <FileText size={14} className="mr-1" />
              メモあり
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepCard;