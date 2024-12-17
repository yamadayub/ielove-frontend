import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface MaterialHeaderProps {
  title: string;
  onBack: () => void;
}

export const MaterialHeader: React.FC<MaterialHeaderProps> = ({ title, onBack }) => {
  return (
    <>
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b md:hidden">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">{title}</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
    </>
  );
};