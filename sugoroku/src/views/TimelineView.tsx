import React from 'react';
import { useStepContext } from '../contexts/StepContext';
import StepCard from '../components/StepCard';
import PhaseFilter from '../components/PhaseFilter';

const TimelineView: React.FC = () => {
  const { getFilteredSteps } = useStepContext();
  
  return (
    <div>
      <PhaseFilter />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {getFilteredSteps().map(step => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;