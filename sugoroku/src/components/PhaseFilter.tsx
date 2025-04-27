import React from 'react';
import { useStepContext } from '../contexts/StepContext';
import { Phase, ALL_PHASES } from '../types';

const PhaseFilter: React.FC = () => {
  const { currentPhase, setCurrentPhase } = useStepContext();

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCurrentPhase('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            currentPhase === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-primary hover:bg-primary-lighter border border-primary'
          }`}
        >
          全フェーズ
        </button>
        {ALL_PHASES.map((phase) => (
          <button
            key={phase}
            onClick={() => setCurrentPhase(phase)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              currentPhase === phase
                ? 'bg-primary text-white'
                : 'bg-white text-primary hover:bg-primary-lighter border border-primary'
            }`}
          >
            {phase}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PhaseFilter;