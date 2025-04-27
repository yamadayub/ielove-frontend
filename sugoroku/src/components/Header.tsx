import React, { useState } from 'react';
import { Menu, X, Home, Grid, LayoutList, FileText } from 'lucide-react';
import { useStepContext } from '../contexts/StepContext';
import { ViewMode } from '../types';

const Header: React.FC = () => {
  const { viewMode, setViewMode, progressPercentage, getCompletedStepsCount } = useStepContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-primary-lighter shadow-md sticky top-0 z-20 w-full">
      <div className="container mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">ietsuku</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex items-center justify-center hover:bg-primary-light/10 rounded-lg transition-colors"
            aria-label="メニュー"
          >
            {isMenuOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-primary" />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-primary-light/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex-grow bg-white/50 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-primary text-sm font-medium whitespace-nowrap">
              {getCompletedStepsCount()}/100
            </span>
          </div>
        </div>
      </div>

      {/* Slide-down menu */}
      <div 
        className={`absolute top-full left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 origin-top ${
          isMenuOpen ? 'scale-y-100' : 'scale-y-0'
        }`}
        style={{ maxHeight: isMenuOpen ? '100vh' : '0' }}
      >
        <div className="container mx-auto px-4 py-2">
          <button
            onClick={() => handleViewChange('boardGame')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              viewMode === 'boardGame' ? 'text-primary bg-primary-lighter' : 'text-primary hover:bg-primary-lightest'
            }`}
          >
            <Home size={20} />
            <span>スゴロク</span>
          </button>
          <button
            onClick={() => handleViewChange('timeline')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              viewMode === 'timeline' ? 'text-primary bg-primary-lighter' : 'text-primary hover:bg-primary-lightest'
            }`}
          >
            <LayoutList size={20} />
            <span>タイムライン</span>
          </button>
          <button
            onClick={() => handleViewChange('grid')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              viewMode === 'grid' ? 'text-primary bg-primary-lighter' : 'text-primary hover:bg-primary-lightest'
            }`}
          >
            <Grid size={20} />
            <span>グリッド</span>
          </button>
          <button
            onClick={() => {
              handleViewChange('notes');
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-primary hover:bg-primary-lightest"
          >
            <FileText size={20} />
            <span>メモ一覧</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;