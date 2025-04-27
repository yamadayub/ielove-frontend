import React from 'react';
import { useStepContext } from '../contexts/StepContext';
import StepCard from '../components/StepCard';
import PhaseFilter from '../components/PhaseFilter';

const GridView: React.FC = () => {
  const { getFilteredSteps } = useStepContext();
  
  return (
    <div>
      <PhaseFilter />
      <div className="grid grid-cols-3 bg-white">
        {getFilteredSteps().map(step => (
          <StepCard key={step.id} step={step} mode="compact" />
        ))}
      </div>
    </div>
  );
};

export default GridView;