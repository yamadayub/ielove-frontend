import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ProductViewTabsProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ProductViewTabs: React.FC<ProductViewTabsProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-lg transition-colors ${
          view === 'grid'
            ? 'bg-gray-900 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-lg transition-colors ${
          view === 'list'
            ? 'bg-gray-900 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <List className="h-5 w-5" />
      </button>
    </div>
  );
};