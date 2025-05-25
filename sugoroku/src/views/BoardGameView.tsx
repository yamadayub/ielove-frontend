import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStepContext } from '../contexts/StepContext';
import { Home } from 'lucide-react';
import PhaseFilter from '../components/PhaseFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const BoardGameView: React.FC = () => {
  const { getFilteredSteps, loading, error } = useStepContext();
  const navigate = useNavigate();
  
  const getCleanTitle = (title: string) => {
    return title.replace(/^Step \d+: /, '');
  };

  const handleStepClick = (stepId: number) => {
    navigate(`/steps/${stepId}`);
  };

  const userSteps = getFilteredSteps();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  return (
    <div>
      <PhaseFilter />
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="bg-primary-lighter/20 rounded-xl p-4 sm:p-6 shadow-inner max-w-2xl mx-auto">
          <div className="relative">
            {userSteps.map((userStep, index) => (
              <div key={userStep.step_id} className="flex items-center gap-4 mb-8">
                <div className="relative flex items-center gap-4 w-full">
                  {/* Connecting line from previous step */}
                  {index > 0 && (
                    <div className="absolute left-[2rem] sm:left-10 -top-8 w-1 bg-primary h-8" />
                  )}
                  
                  <button
                    onClick={() => handleStepClick(userStep.step_id)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-lg flex-shrink-0 relative z-10 ${
                      userStep.is_completed 
                        ? 'bg-primary text-white' 
                        : 'bg-white text-primary hover:bg-primary-lighter'
                    }`}
                  >
                    {userStep.step.id === 1 ? (
                      <Home size={24} className="sm:w-8 sm:h-8" />
                    ) : (
                      <span className="font-bold text-lg sm:text-2xl">{userStep.step.id}</span>
                    )}
                  </button>

                  <button
                    onClick={() => handleStepClick(userStep.step_id)}
                    className="bg-white rounded-lg shadow-md p-3 flex-grow hover:bg-primary-lightest transition-colors relative z-10"
                  >
                    <p className="text-sm font-medium text-primary">
                      {getCleanTitle(userStep.step.title)}
                    </p>
                  </button>

                  {/* Connecting line to next step */}
                  {index < userSteps.length - 1 && (
                    <>
                      <div className="absolute left-[2rem] sm:left-10 top-full w-1 bg-primary h-8 -mb-8" />
                      <div className="absolute left-[calc(2rem-4px)] sm:left-[calc(2.5rem-4px)] top-[calc(50%-4px)] w-2 h-2 rounded-full bg-primary" />
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Goal */}
            <div className="text-center mt-16 relative">
              <div className="absolute left-[2rem] sm:left-10 -top-8 w-1 bg-primary h-8" />
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary text-white rounded-full mx-auto flex items-center justify-center shadow-xl relative z-10">
                <span className="font-bold text-2xl sm:text-3xl">GOAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardGameView;